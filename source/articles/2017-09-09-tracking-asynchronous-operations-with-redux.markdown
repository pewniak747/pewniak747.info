---
title: Tracking asynchronous operations with redux
date: 2017/09/09
---

A frequent complaint against [redux][Redux] is the amount of code needed to achieve seemingly simple things.
Which gets worse when those simple things are also common, leading to lots and lots of similar code.
This is often dubbed *boilerplate*, and posed to be obviously bad (after all, Don't Repeat Yourself is the law, right?).

Not necessarily so (I think DRY is a very overrated principle, but that's a thought for another post).
One thing the boilerplate is useful for is identifying patterns.
If there's a lot of identical code in multiple places in the codebase (not two, not three, ideally four or more), that's a strong indicator we're missing an *abstraction*.

There's a particular use case for abstractions in redux apps - happens very often, feels repetitive, and could use a better solution.

That use case is: **performing AJAX requests**.

*(note: if all your app really does is simple data fetching - [You might not need redux][DontNeedRedux])*

## Requirements

Let's identify what are the requirements of a feature that fetches a list of widgets.

The redux state needs to know:

* Whether the widgets are loading or not
* Whether the widgets have been loaded successfully or not
* Error details if the request has failed
* The widget data itself

A common way to implement this feature with redux (using best practices for action creators etc) involves writing:

* 3 action types (`WIDGETS_REQUEST`, `WIDGETS_SUCCESS`, `WIDGETS_FAILURE`)
* 3 action creators (`widgetsRequest`, `widgetsSuccess`, `widgetsFailure`)
* A reducer that sets the appropriate fields in the state
* A [thunk][ReduxThunk] dispatching the actions and performing the ajax request itself

It might look like this:

```js
const WIDGETS_REQUEST = 'WIDGETS_REQUEST';
const WIDGETS_SUCCESS = 'WIDGETS_SUCCESS';
const WIDGETS_FAILURE = 'WIDGETS_FAILURE';

function widgetsRequest() {
  return {
    type: WIDGETS_REQUEST
  };
}

function widgetsSuccess(widgets) {
  return {
    type: WIDGETS_SUCCESS,
    payload: { widgets }
  };
}

function widgetsFailure(error) {
  return {
    type: WIDGETS_FAILURE,
    payload: { error }
  };
}

const initialState = {
  widgets: [],
  isLoading: false,
  isLoaded: false,
  error: null,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case WIDGETS_REQUEST:
      return {
        ...initialState,
        isLoading: true,
      }
    case WIDGETS_SUCCESS:
      return {
        ...initialState,
        isLoaded: true,
        widgets: action.payload.widgets,
      }
    case WIDGETS_FAILURE:
      return {
        ...initialState,
        error: action.payload.error,
      }
    default:
      return state;
  }
}

function fetchWidgetsThunk() {
  return function(dispatch) {
    dispatch(widgetsRequest());
    fetch('/widgets.json')
      .then(response => response.json())
      .then(
        (response) => dispatch(widgetsSuccess(response.widgets)),
        (error) => dispatch(widgetsFailure(error.message)),
      );
  }
}
```

For the sake of simplicity, the example assumes we're not storing our widgets in a normalized state shape ([which is recommended][ReduxNormalizedState]), and instead just keep them in a list.

Even so, it's quite a lot of code... If we're not using the [ducks pattern][ReduxDucks], it's also spread across multiple files / directories.
And don't forget the tests for it!

The biggest overhead is in implementing the reducer that tracks the request state (`isLoading`, `isLoaded`, `error` fields).
Let's see if we can find an abstraction here.

## Operations

We can think of fetching the widgets as an asynchronous operation.
There are three possible actions (start, success, failure) that might change its state.
The state changes are defined as follows:

* start action makes the operation pending
* success action makes the operation finished (not pending) and successful
* failure action makes the operation finished and not successful - with optional error details

The reducer and actions behave in the same way for every operation.

Now that the functionality is defined and isolated, we can abstract it away.
Imagine a `createOperation` function that accepts a string (unique operation name) and returns an object with action types, action creators and a reducer, already wired up to work together:

```js
const operation = createOperation('NAME');

const { START, SUCCESS, FAILURE } = operation.actionTypes;
const { start, success, failure } = operation.actionCreators;
const { reducer, initialState } = operation;
/*
initialState = {
  pending: false,
  success: false,
  failure: false,
  errors: null
}
*/
```

In this state shape, `isFetching` and `isFetched` are renamed to more fitting `pending` and `success` boolean fields. Also, the `failure` boolean is separate from optional `errors` details.

When the actions `start`, `success` and `failure` are dispatched to the store, the generated reducer causes a state update (setting the appropriate boolean fields and error details).
We also export `initialState` (useful for tests) and action types (so other reducers can react to the actions, for example by saving data somewhere else in the state).

```js
const pendingState = reducer(initialState, start());
// { pending: true, success: false, failure: false, errors: null }
const successState = reducer(pendingState, success({ payloadExample: [] }));
// { pending: false, success: true, failure: false, errors: null }
const failureState = reducer(pendingState, failure('An error'));
// { pending: false, success: false, failure: true, errors: 'An error' }
```

With the `createOperation` function, the widgets feature now looks like this:

```js
import { combineReducers } from 'redux';

const fetchOperation = createOperation('FETCH_WIDGETS');

function widgetsReducer(state = [], action) {
  switch (action.type) {
    case fetchOperation.actionTypes.SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

const reducer = combineReducers({
  widgets: widgetsReducer,
  status: fetchOperation.reducer
});

function fetchWidgetsThunk() {
  return function(dispatch) {
    const { start, success, failure } = fetchOperation.actionCreators;
    dispatch(start());
    fetch('/widgets.json')
      .then(response => response.json())
      .then(
        (response) => dispatch(success(response.widgets)),
        (error) => dispatch(failure(error.message))
      );
  }
}
```

This is much shorter! The mundane details of tracking the pending / successful / error states are abstracted away by the `fetchOperation`, and stored in a separate slice of state (in this case, `status`).

## Summary

There are a [multitude][ReduxThunk] [of][ReduxSaga] [existing][ReduxAPIMiddleware] [ways][ReduxPromiseMiddleware] to handle AJAX requests with redux. However, they still require implementing the same reducer logic over and over again.

Using the operation abstraction has following benefits:

* Reduces the amount of redux code / test code written for tracking the request status. This decreases the possibility of bugs.
* Decouples data state (widget attributes) from meta-data state (are widgets loading?).
* Can be used with [thunks][ReduxThunk], [sagas][ReduxSaga], [custom middlewares][ReduxAPIMiddleware], or any other method for handling async effects. Simply use the generated action creators!
* Does not depend on anything other than the existing redux abstractions.
* By exporting action types, other reducers can react to single operation state changes as well.
* Can be used to track any kind of asynchronous operation, not limited to fetching and updating data via AJAX.

To me, this solution shows the beauty of redux: it is simple and powerful.
Because redux is so unopinionated, and uses plain objects and functions (no magic), it can sometimes feel verbose.
But developers are able to create and compose elegant abstractions on top of it.

Speaking of which, implementing the `createOperation` function is left as an excercise to the reader.
You can treat it as a programming koan to sharpen your skills.
If you're interested, my implementation is available below:
<details>
<summary>See the code</summary>

```js
function createOperation(name) {
  const START = `${name}/START`;
  const SUCCESS = `${name}/SUCCESS`;
  const FAILURE = `${name}/FAILURE`;

  const start = (payload) => ({ type: START, payload });
  const success = (payload) => ({ type: SUCCESS, payload });
  const failure = (payload) => ({ type: FAILURE, payload });

  const initialState = {
    pending: false,
    success: false,
    failure: false,
    errors: null
  };

  const reducer = (state = initialState, action) => {
    switch(action.type) {
      case START:
        return { ...initialState, pending: true };
      case SUCCESS:
        return { ...initialState, success: true };
      case FAILURE:
        return { ...initialState, failure: true, errors: action.payload };
      default:
        return state;
    }
  };

  const actionCreators = { start, success, failure };
  const actionTypes = { START, SUCCESS, FAILURE };

  return { actionCreators, actionTypes, initialState, reducer };
}
```

</details>

[Redux]: https://github.com/reactjs/redux
[DontNeedRedux]: https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367
[ReduxDucks]: https://github.com/erikras/ducks-modular-redux
[ReduxNormalizedState]: http://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html
[ReduxThunk]: https://github.com/gaearon/redux-thunk
[ReduxSaga]: https://github.com/redux-saga/redux-saga
[ReduxAPIMiddleware]: https://www.npmjs.com/package/redux-api-middleware
[ReduxPromiseMiddleware]: https://github.com/acdlite/redux-promise
