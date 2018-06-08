'use strict'

const { test } = require('tap')
const SemVerStore = require('./index')

test('Should create a store', t => {
  t.plan(1)

  const store = SemVerStore()

  store.set('1.2.3', 1)
  store.set('1.2.4', 2)
  store.set('1.3.0', 3)

  t.deepEqual(store.tree, {
    prefix: 0,
    store: null,
    childrenPrefixes: [1],
    children: {
      1: {
        prefix: 1,
        store: null,
        childrenPrefixes: [2, 3],
        children: {
          2: {
            prefix: 2,
            store: null,
            childrenPrefixes: [3, 4],
            children: {
              3: {
                prefix: 3,
                store: 1,
                childrenPrefixes: [],
                children: null
              },
              4: {
                prefix: 4,
                store: 2,
                childrenPrefixes: [],
                children: null
              }
            }
          },
          3: {
            prefix: 3,
            store: null,
            childrenPrefixes: [0],
            children: {
              0: {
                prefix: 0,
                store: 3,
                childrenPrefixes: [],
                children: null
              }
            }
          }
        }
      }
    }
  })
})

test('Should get the leaf', t => {
  t.plan(1)

  const store = SemVerStore()

  store.set('1.2.3', 1)
  store.set('1.2.4', 2)
  store.set('1.3.0', 3)

  t.strictEqual(store.get('1.2.4'), 2)
})

test('Should get the leaf (wildcard) / 1', t => {
  t.plan(1)

  const store = SemVerStore()

  store.set('1.2.3', 1)
  store.set('1.2.4', 2)
  store.set('1.3.0', 3)

  t.strictEqual(store.get('1.2.x'), 2)
})

test('Should get the leaf (wildcard) / 2', t => {
  t.plan(1)

  const store = SemVerStore()

  store.set('1.2.3', 1)
  store.set('1.2.4', 2)
  store.set('1.3.0', 3)

  t.strictEqual(store.get('1.x'), 3)
})

test('Should get the leaf (wildcard) / 3', t => {
  t.plan(1)

  const store = SemVerStore()

  store.set('1.2.3', 1)
  store.set('1.2.4', 2)
  store.set('1.3.0', 3)

  t.strictEqual(store.get('2.2.x'), null)
})

test('Should get the leaf (wildcard) / 4', t => {
  t.plan(1)

  const store = SemVerStore()

  store.set('1.2.3', 1)
  store.set('1.2.4', 2)
  store.set('1.3.0', 3)

  t.strictEqual(store.get('2.x'), null)
})

test('Missing patch', t => {
  t.plan(1)

  const store = SemVerStore()

  store.set('1.2.3', 1)
  store.set('1.2.4', 2)
  store.set('1.3.0', 3)

  t.strictEqual(store.get('1.2'), 2)
})

test('Should get the leaf - 404', t => {
  t.plan(1)

  const store = SemVerStore()

  store.set('1.2.3', 1)
  store.set('1.2.4', 2)
  store.set('1.3.0', 3)

  t.strictEqual(store.get('1.2.5'), null)
})

test('Should get the leaf (bad formatted semver) / 1', t => {
  t.plan(1)

  const store = SemVerStore()

  store.set('1.2.3', 1)
  store.set('1.2.4', 2)
  store.set('1.3.0', 3)

  t.strictEqual(store.get('1.2.a'), null)
})

test('Should get the leaf (bad formatted semver) / 2', t => {
  t.plan(1)

  const store = SemVerStore()

  store.set('1.2.3', 1)
  store.set('1.2.4', 2)
  store.set('1.3.0', 3)

  t.strictEqual(store.get('1.a'), null)
})

test('Big numbers', t => {
  t.plan(1)

  const store = SemVerStore()

  store.set('1.22.34', 1)
  store.set('2.32.456', 2)
  store.set('345.432.34', 3)
  store.set('343.432.36', 4)
  store.set('343.432.342', 5)
  store.set('343.435.367', 6)
  store.set('342.435.34', 7)
  store.set('341.432.34', 8)

  t.strictEqual(store.get('343.x'), 6)
})