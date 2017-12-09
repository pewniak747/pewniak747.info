---
title: Testing redux action sequences
date: 2017/11/01
---

Testing the features implemented with redux (actions, reducers) is conceptually quite easy. This is due to redux' simplicity. Actions are plain objects, and reducers are pure functions that accept everything they need as arguments. There's no need to mock the external world.

On the other hand, a lot of small unit tests are required to fully test an impact of every action and state transition. That could deter from writing them in the first place.

I think that we developers should harness redux' simplicity to write better tests. I want to share two approaches I use for more complete redux coverage, especially when dealing with action sequences.

## Setup

Let's have an obligatory `counter` reducer as an example.
The possible actions should be incrementing and decrementing the counter.

```js
// Constants
const INCREMENT = "counter/INCREMENT";
const DECREMENT = "counter/DECREMENT";

// Action creators
const increment = () => ({ type: INCREMENT });
const decrement = () => ({ type: DECREMENT });

// Reducer
const initialState = { count: 0 };
function counter(state = initialState, action) {
  switch(action.type) {
    case INCREMENT:
      return { ...state, count: state.count + 1 };
    case DECREMENT:
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}
```

The most basic tests of this reducer would have a simple structure: given an initial state and an action, the resulting state should be equal to the expected state:

```js
const initialState = { count: 3 };
const action = increment();
const expectedState = { count: 4 };

expect(counter(initialState, action)).toEqual(expectedState);
```

Tests of this kind are very useful, but they quickly become repetitive and too numerous, because we only test one state / action at a time.

So, here are a few more ways that we can test a sequence of actions.

## Reducing a sequence of actions to single state

One kind of a useful reducer test is the one that asserts what the state is after a sequence of actions has been processed (for example, incrementing twice and decrementing once).

Here's what it may look like: it defines an initial state and invokes the reducer with intermediate states and every action in turn.
At the end, it assert that the state is correct.

```js
const initialState = { count: 0 };
const state1 = counter(initialState, increment());
const state2 = counter(state1, increment());
const state3 = counter(state2, decrement());
expect(state3).toEqual({ count: 1 });
```

Notice the explicit variables for the intermediate states. This approach gets very tedious when testing long sequences of actions.

Luckily, we can rewrite that test using the `Array.prototype.reduce` function. This function iterates over an array, passing an accumulator variable (the state) and array item (an action) to another function.
This function would be our `counter` reducer. The `reducer` naming in redux is no coincidence, as it's directly inspired by `Array.prototype.reduce`!

```js
const initialState = { count: 0 };
const actions = [increment(), increment(), decrement()];
const expectedState = { count: 1 };

expect(actions.reduce(counter, initialState)).toEqual(expectedState);
```

The intermediate variables are gone and the test looks much cleaner, as well as is more extendable for longer action sequences.

Bonus point 1: if the `Array.prototype.reduce` version is not readable enough, I recommend creating a small helper function, e.g. `reduceState`.

```js
// testHelpers.js
function reduceState(reducer, initialState, actions) {
  return actions.reduce(reducer, initialState);
}

// counter.test.js
expect(reduceState(counter, initialState, actions)).toEqual(expectedState);
```

If you're using the excellent functional utility library [Ramda][Ramda], its [reduce][RamdaReduce] function does exactly that as well:

```js
import R from "ramda";

const reduceState = R.reduce;
```

Bonus point 2: so far the examples haven't imported the redux library code at all. But, we can also rewrite the previous test by instantiating the store with our small reducer. This is a bit more verbose, but could be useful as well.

```js
import { createStore } from "redux";

const initialState = { count: 0 };
const store = createStore(counter, initialState);
store.dispatch(increment());
store.dispatch(increment());
store.dispatch(decrement());
expect(store.getState()).toEqual({ count: 1 });
```

## Accumulating state while reducing

Another type of test is also concerned with a sequence of actions, but it asserts correct state at every step, not only at the end.
This way we can have more granular expectations about how the state changes.

```js
const initialState = { count: 0 };
const state1 = counter(initialState, increment());
expect(state1).toEqual({ count: 1 });
const state2 = counter(state1, increment());
expect(state2).toEqual({ count: 2 });
const state3 = counter(state2, decrement());
expect(state3).toEqual({ count: 1 });
```

There's a way of making this test more succinct; however, it requires a small helper, not present in the core language like `Array.prototype.reduce`.
This helper will accept a reducer, initial state and array of actions, and return an array of states, beginning from the initial, through intemediate, and ending in the final state.

Let's call it `accumulateState`:

```js
function accumulateState(reducer, initialState, actions) {
  const result = [initialState];
  actions.forEach((action) => {
    const currentState = result[result.length - 1];
    const nextState = reducer(currentState, action);
    result.push(nextState);
  });
  return result;
}
```

Using the helper method, the test looks like this:

```js
const initialState = { count: 0 };
const actions = [increment(), increment(), decrement()];
const expectedStates = [{ count: 0 }, { count: 1 }, { count: 2 }, { count: 1 }];

expect(accumulateState(counter, initialState, actions)).toEqual(expectedStates);
```

Bonus point 1: this approach works great with [jest][Jest] and [snapshot testing][SnapshotTesting]. The expected states array can be conveniently captured as a snapshot:

```js
const initialState = { count: 0 };
const actions = [increment(), increment(), decrement()];
expect(accumulateState(counter, initialState, actions)).toMatchSnapshot();
```

Bonus point 2: if you're using [Ramda][Ramda], there's no need to implement a helper - Ramda already has a function that has this exact behaviour.
It's called [scan][RamdaScan].

```js
import R from "ramda";

const accumulateState = R.scan;
```

Bonus point 3: analogously, the store version would look like this:

```js
import { createStore } from "redux";

const initialState = { count: 0 };
const store = createStore(counter, initialState);
store.dispatch(increment());
expect(store.getState()).toEqual({ count: 1 });
store.dispatch(increment());
expect(store.getState()).toEqual({ count: 2 });
store.dispatch(decrement());
expect(store.getState()).toEqual({ count: 1 });
```

## Summary

In this article, I introduced two little utility functions for testing redux reducers: `reduceState` and `accumulateState`. These fuctions should aid in testing long sequences of actions. For me, these tests also feel more concrete: we're testing how the state changes during the entire interaction, not only one transition at a time.

A word of clarification: in my examples, I used the action creators (`increment`, `decrement`) instead of plain object actions. This way, the reducer and action creators are tested "together" in a single test. I think that's fine; in fact, it gives me more confidence that the two will work together correctly in a real application. I tend not to write unit tests for action creators alone (unless they contain some tricky logic, but that's very rare).

I hope these techniques are useful. What other approaches do you use in your tests? Let me know in the comments!

[Jest]: https://facebook.github.io/jest
[SnapshotTesting]: https://facebook.github.io/jest/docs/en/snapshot-testing.html
[Ramda]: http://ramdajs.com
[RamdaReduce]: http://ramdajs.com/docs/#reduce
[RamdaScan]: http://ramdajs.com/docs/#scan
