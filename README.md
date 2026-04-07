## 1. What is the difference between var, let, and const?

Ans :

- Var - It is globally scoped, and can be hoisted and re-declared.
- Let - It is block scoped, and can not be re-declared but can be updated.
- Const - It is block scoped as well, but we can not re-declare it nor update it.

## 2. What is the spread operator (...)?

Ans : It's a very handy operator we can used this in various case here's some example

### Copy Array or Object

```js
const arr = [1, 2, 3];
const newArray = [...arr]; // [1,2,3]

// this way newArray is not pointing the reference of arr rather a copy of arr

// same can be done with object
const me = { name: "Onamika" };
const myCopy = { ...me }; // { name: "Onamika" };
```

## 3. What is the difference between map(), filter(), and forEach()?

Ans :

Map - It returns a new array with transformation

```js
const arr = [1, 2, 3];
const doubleArr = arr.map((i) => i * 2); // [2,4,6]
```

Filter - It return a new array by filtering which match the condition

```js
const arr = [1, 2, 3];
const even = arr.filter((i) => i % 2 === 0); // [2]
```

Foreach - We can perform some action on each element

```js
// get total of an array
const arr = [1, 2, 3, 4];
let total = 0;
arr.forEach((i) => {
  total += i;
});

// total => 10
```

## 4. What is an arrow function?

Ans : Array function is a shorter way to write function

```js
// One liner
const add = (a, b) => a + b;
const sum = add(10, 2); // 12
```

## 5. What are template literals?

Ans : We can use this by using backticks (`) it's used to make complex string concatenation

```js
const name = "Onamika";
const message = `Hey there ${name}`; // Hey there Onamika
```
