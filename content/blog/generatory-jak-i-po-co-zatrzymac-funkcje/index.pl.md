---
title: Generatory - jak i po co zatrzymać funkcje?
date: 2020-11-30
author: Michał Paczków
publish: true
description: ""
image: assets/cover.jpg
imageCredit: "Zdjęcie: [John Matychuk](https://unsplash.com/@john_matychuk)"
categories:
  - Javascript
tags:
  - iterator
  - iterable
  - generator
  - react
---

Funkcje są jednym z podstawowych "klocków" w programistycznym świecie. Tworzymy je, żeby zamknać powtarzającą się logikę, wykonać jakieś zadanie, czy obliczyć wartość. Jest to z pewność jedna z pierwszych rzeczy o jakiej uczyłeś się wchodząc do świata programowania.

Przyjmuje ona listę argumentów, przetwarza pewną logikę, a następnie zwraca pojedynczą wartość (lub żadnej). Jednak są obiekty, które pozwalają zmienić to zachowanie, funkcja może zwrócić wartość kilkukrotnie czy nawet zostać zatrzymana. Co to za obiekty?

## Generatory, czym one są?

Odpowiedzią na pytanie postawione w poprzednim akapicie są generatory. Są to obiekty, dzięki którym mamy wpływ na przetwarzanie funkcji. Możemy ją zatrzymać, a następnie wznowić. Spójrzmy na poniższy kod:

```javascript
function doTask() {
  console.log("I'm working on task");
}

function* createGenerator() {
  yield 5;
  return 10;
}

const generator = createGenerator();
console.log(generator.next()); // { value: 5, done: false }
console.log(doTask()); // "I'm working on task"
console.log(generator.next()); // { value: 10, done: true }
console.log(generator.next()); // { value: undefined, done: true }
```

Widzimy tu kilka istotnych rzeczy:

- `function*` - znak `*` oznacza , że jest to funkcja generatora (ang. generator function), specjalny rodzaj funkcji, który zwróci nam obiekt generatora
- `yield` - słowo kluczowe związane z generatorem. W momencie napotkania `yield`:
  - wykonywanie funkcji zostaje zatrzymane
  - jej stan jest zapisywany (miejsce w którym została zatrzymana oraz wszelkie zmienne funkcji)
  - zwracana jest wartość znajdująca się po prawej stronie `yield`
- `generator.next()` - główna funkcja generatora, jej wywołanie powoduje wykonanie funkcji, aż do napotkania najbliższej insturkcji `yield`. Innymi słowy rozpoczyna lub wznawia ona wykonywanie funkcji.

Powyższy rzeczy prowadzą nas do kilku istotnych wnisoków:

1. Samo wywołanie funkcji generatora, **zwróci tylko obiekt**. Jeśli chcemy, aby rozpoczęło się wykonywanie funkcji należy wywołać przynajmniej raz metodę `next`
   <!-- TODO: dodać, że dostaniemy wartość tylko gdy o to poprosimy -->
2. Metoda `next`, oraz jej rezultat `{ value, done }` odpowiada implementacji iteratora. Nie ma w tym przypadku, generatory mają ułatwić pracę z iteratorami. Jeśli chcesz dowiedzieć się więcej na temat iteratora i protokłów iteracyjnych zapraszam [tutaj](https://miscoded.io/pl/blog/protokoly-iteracyjne-ile-wiesz-o-iteracji/)
3. Można zakończyć wykonywanie funkcji poprzez instrukcję `return`, w przeciwnym wypadku funkcja zakończy się po ostatniej instrukcji. O zakończeniu informuje wartości `done` zwracanego obiektu, równa `true`.

```javascript
function* generateValue() {
  yield 1;
}

const generator = generateValue();
console.log(generator.next()); // { value: 1; done: false} <- function is stopped in the last step before finishing
console.log(generator.next()); // { value: undefined; done: true }
```

W powyższym kodzie widzimy, zatrzymanie wykonywania funkcji, na ostatnim kroku. Jeśli ją wznowimy funkcja po prostu zakończy się o czym informuje `done` równe true.

> Jeśli nie dodamy instrukcji `return` w funkcji, zostanie ona dodana poprzez silnik w momencie (???), a konkretnie `return undefined`

Poniżej animacja, pokazująca działania stworzenie i działanie generatora:

<!-- TODO: GIF/Animtation how we can create iterator and how it call it later -->

## Generator, a iteracja

Wspomniałem, że generator jest iteratorem (implementuje protokoł iteratora). Możesz traktować go jak wskażnik, który pokazuje czy zakończone generowanie elementów, czy nie (`done`), oraz zwraca wartość każdego z elementów.

Generator jest również `iterable`, oznacza to, że instrukcje jak `for..of` czy `spread` mogą użyć go do wyciągnięcia elementów.

```javascript
function* createGenerator() {
  for (let i = 0; i < 3; i++) {
    yield i;
  }
}

const generator = createGenerator();

for (let element in generator) {
  console.log(element); // 0 1 2
}
```

Oznaczona to, że generator implementuje właściwości o nazwie `Symbol.iterator`, która służy do rozpoznania czy struktura danych jest iterowalna, funkcja do niej przypisana zwraca `this`, dzięki czemu podczas iteracji wykorzystywana jest funkcja `next`.

Poniżej możecie zobaczyć to w poniższym kodzie. Dodatkowo zamieściłem tam własną implementację generatora opierając się o protkoły iteracyjne. Widać tu jak użycie generatora skraca kod i czyni go czytelniejszym.

```javascript
function* createGenerator() {
  for (let i = 0; i < 3; i++) {
    yield i;
  }
}
const generator = createGenerator();

// console.log: "f() { return this; }"
console.log(Symbol.iterator in generator && generator[Symbol.iterator]);
/* use iterable */
for (let element of generator) {
  console.log(element); // 0 1 2
}

/* the equivalent of generator object */
const myGenerator = {
  counter: 0,
  [Symbol.iterator]: function() {
    return this;
  },
  next: function() {
    if (this.counter < 3) {
      return { value: this.counter++, done: false };
    }
    return { vaule: undefined, done: true };
  },
};
/* use iterable */
for (let element of myGenerator) {
  console.log(element); // 0 1 2
}
```

### Jak iterować od początku?

Wspomniałem, już, że generator jest wskażnikiem, który zwróci aktulana wartości i poinformuje, czy pojawi się następna wartość w sekwencji. Ma jednak pewne ograniczenie - nie może poruszać się do tyłu, oznacza to, że jeśli chcemy iterować od początku należy stworzyć nowy generator.

> Działanie `for..of` opiera wywołanie kolejnych `generator.next()`, do momentu w którym właściowść `done` obiektu zwróconego przez `next` jest równa `true`

```javascript
function* gen() {
  for (let i = 0; i < 7; i++) {
    yield i;
  }
}

const generator = gen();

for (let element of generator) {
  if (element > 3) return;
  console.log(element); // 0 1 2 3
}
// the generator is not restarted, it continuous an iteration
for (let element of generator) {
  console.log(element); // 4 5 6
}
```

### Uważaj na `return` podczas iteracji

Instrukcja `return` w generatorze zwraca obiekt `{ value, anyValue, done: true }`. Intrukcja `for..of` pomija zwrócenia wartości, gdy `done` jest równe `true`, tym samym wartość zwracana przez return nie zostanie wykorzystana.

```javascript
function* gen() {
  yield 1;
  return 2;
}

for (let element of gen()) {
  console.log(element); // 1
}
```

## Komunikacja dwukierunkowa - "yield"

Słowo kluczowe `yield` zapewnia nie tylko zwrócenie wyników z funkcji, działa też w drugą stronę. Pozwala przesłać do funkcji argumenty poprzez funkcję `next`. Oznacza to, że przy każdym wznowieniu, funkcja może otrzymać argument, przypisywany jest od do zmiennej będącej po lewej stronie `yield`:

```javascript
function* gen() {
  let number = yield "The next natural number after 1 is: ";
  while (true) {
    number = yield number === 1 ? "Correct! It's 2." : "Wrong. It should be 2.";
  }
}

const generator = gen();

console.log(generator.next().value); // The next natural number after 1 is:
console.log(generator.next(1).value); // Correct! It's 2.
console.log(generator.next(2).value); // Wrong. It should be 2.
```

W powyższym przykładzie widzimy, że generator zwraca wartości tylko na żądanie - wywołanie `next`.

<!-- TODO: image with assigning arg from next to variable, like here: https://javascript.info/generators -->

### generator.throw

Przy okazji, przesyłania danych do generatora, należy wspomnieć o obsłudze błędów. Generatorowi możemy przekazać informację o wystąpieniu błędu, co poskutkuje wyłapaniem go w najbliższym bloku `try-catch`:

```javascript
function* gen() {
  try {
    let result = yield "2 + 2 = ?";

    console.log(
      "The execution does not reach here, because the exception is thrown above"
    );
  } catch (e) {
    console.log(e); // shows the error
  }
}

let generator = gen();

let question = generator.next().value;

generator.throw(new Error("The answer is not found in my database"));
```

Przeszliśmy przez wszystkie najważniejsze elementy generatorów, teraz czas odpowiedzieć sobie na pytanie jak możemy je wykorzystać w naszej codziennej pracy.

## Generatory w praktyce

Zacznijmy od często zadawanego pytania na forach to: `yield vs async-await`. Moją odpowiedzią jest `async-await`.

Jeśli chcemy rozwiązać wyłączone problemy z asynchronicznością jest to bardziej przejrzyse i zalecane rozwiązanie: _"Just as Promises are similar to structured callbacks, async/await is similar to combining generators and promises"_ - [zródło](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

Jednak generatory wciąż mają swoje miejsce (przynajmniej tak jest w momencie pisania tego postu). Jak dowiedziałeś się w poprzednich rozdziałach, generatory przyjmują jak i zwracają dane. Oznacza to, że generator możemy traktować jako:

- producenta - generatory dzięki wykorzystaniu `yield` zwracają wartość przy każdym wywołaniu `next`. Dodatkowo generatory to obiekty iterowalne, oznacza to, że mogą generować sekwencję wartości na żadanie (skończoną lub nieskończoną), które będą przetworzone przez np. `for..or` lub `spread`. Przykład:

  - generowanie kolejnych dopasowanych elementów przy użyciu `regex.exec`, [źródło i przykład](https://swizec.com/blog/finally-a-practical-use-case-for-javascript-generators)

- konsumenta - dzięki temu, że `yield` może zostać wykorzystanie do przesłania danych, generator staje się konsumentem, który wstrzymuje wykonanie pewnej logiki aż do otrzymanie określonych elementów: Przykład:

  - zwrócenie danych dopiero po otrzymaniu pełnego zestaw, [źródło i przykład](https://jameshfisher.com/2019/05/18/javascript-generators-are-also-consumers/)

- konsumenta + producenta - powyższe dwie "zdolności" generatora można połączyć, dzięki temu może on zostać wykorzystany do zarządzaniem flow programu np. zarządzania stanem, przykład: [redux-saga](https://redux-saga.js.org/)

### Praktyczny przykład - ??
