---
title: '"Deklaracje przodem!" - Hoisting'
date: 2020-06-06
author: Michał Paczków
publish: true
image: assets/cover.jpg
imageCredit: "Zdjęcie: [Bence Balla-Schottner](https://unsplash.com/@ballaschottner)"
description: Co odpowiada za wywołanie funkcji przed jej deklaracją i dlaczego może to zmylić programistę? Odpowiedź w drugim artykule z serii "Opanuj fundamenty!"
categories:
  - Javascript
tags:
  - silnik-javascript
  - fundamenty-javascript
---

Witam Cię w drugim artykule z serii "Opanuj Fundamenty". Opisuję w niej działanie silnika Javascript. W poprzednim artykule zajęliśmy się kontekstem wykonania (ang. Execution Context). Dziś omówimy Hoisting. Dlaczego ta nazwa jest nieprecyzyjna? Jaka jest różnica między `var`, a `let`? Jak silnik Javascript realizuje ten mechanizm? Czy są jakieś praktyczne powody, aby go użyć? Na te pytania znajdziesz odpowiedź w dzisiejszym poście. Zapraszam!

## Hoisting

Po polsku najbardziej odpowiednim słowem jest "wynoszenie" bądź "windowanie". Jeśli jesteśmy już przy nazwie, należy powiedzieć, że, jest ona nieprecyzyjna i może zmylić programistę. Zanim jednak przejdę do wyjaśnienia, zaczniemy od przykładu:

```javascript
console.log(sayHello("World")); // result of calling it?

function sayHello(name) {
  console.log("Hello " + name);
}
```

Wiesz co zostanie wyświetlone w konsoli? Bardzo często padają 3 różne odpowiedzi. Są to:

1. "aaa pewnie jakiś błąd"
2. undefined
3. "Hello World"

Jeśli wybrałeś 3 opcję, brawo! To poprawna odpowiedź. Na pytanie "dlaczego tak się dzieje" wiele osób w tym momencie odpowie, że deklaracja `sayHello` przenoszona jest na górę bloku i dzięki temu w `console.log` mam do niej dostęp, nawet jeśli w kodzie przez nas napisanym funkcja znajduje się poniżej, stąd _wynoszenie_.

W takim razie, dlaczego nazwa jest myląca? Czego się czepiasz autorze?!

Będąc precyzyjnym nazwa wynoszenie, została użyta tu jako opis koncepcji, służy do zobrazowania tego, co się dzieje. Jeśli jednak powiesz, że silnik JS przenosi deklarację funkcji powyżej jej wywołania to błąd! **Kod deklaracji nigdy nie jest przenoszony na górę bloku przez silnik Javascript**. Zatem w jaki sposób jest to realizowane?

Jeśli czytałeś mój [poprzedni post](https://miscoded.io/pl/blog/fundamenty-javascript-kontekst-wykonania), dowiedziałeś się o dwóch fazach jakie wykonuje silnik Javascript podczas przetwarzania kodu. Są to:

1. faza tworzenia (ang. Creation Phase)
2. faza wykonania (ang. Execution Phase).

W ramach przypomnienia: w momencie wejścia do nowego zakresu np. poprzez wywołanie funkcji tworzony jest kontekst wykonania (ang. Execution Context). Jest to obiekt, który posiada informacje o środowisku w którym wykonywany jest bieżący kod. Takim informacjami są:

- obiekt na który wskazuje słowo kluczowe `this`
- dostępne nazwy zmiennych i funkcji w bieżącym zakresie
- odniesienie do zakresu zewnętrznego

Wszystkie wyżej wymienione informacje definiowane są w fazie tworzenia, zanim jeszcze zostanie wykonana pierwsza linijka kodu w bieżącym bloku. Jak do tego ma się wynoszenie?

Podczas pierwszej fazy, silnik Javascript skanuje bieżący blok kodu. Każda znaleziona deklaracja jest odpowiednio inicjalizowana, a jej identyfikator dodawany do struktury zwanej `VariableEnvironment`, będącej jednym z elementów kontekstu wykonania. Dzięki temu w fazie wykonania mamy do niej dostęp w obrębie całego bloku. Jak widzisz nie nastąpiło tu żadne fizyczne przeniesienie. Poniżej animacja przedstawiająca fazę tworzenia i wykonania.

<figure style="width: 100%; margin-left: 0;">
  <a href="assets/execution-context.gif">  
    <img style="width: 100%" src="assets/execution-context.gif"/>
  </a>
  <figcaption>Faza tworzenia i wykonania dla kontekstu globalnego i funkcji</figcaption>
</figure>

W przypadku wynoszenia ważne jest zrozumieniem zarówno abstrakcyjnej koncepcji, obrazującej ten proces jako przeniesienie deklaracji na górę bloku, jak i kroków wykonywanych przez silnik Javascript. Tylko wtedy jesteśmy w stanie dobrze zrozumieć i odpowiednio wykorzystać ten fundament języka Javascript. Przejdźmy teraz do szczegółów w kontekście zmiennych i funkcji oraz do przykładów, które powinny pomóc w lepszym zrozumieniu tego zagadnienia.

## Wynoszenie zmiennych

Zaczniemy sobie od zmiennych zadeklarowanych przez słowo kluczowe `var`. W momencie napotkania deklaracji podczas fazy tworzenia silnik Javascript inicjalizuje ją wartością `undefined`, a następnie odkłada jej identyfikator do `VariableEnvironment`. Jak już zostało wspomniane dzięki temu w momencie w którym zacznie się wykonywanie kodu (faza druga) zmienna jest już dostępna w ramach całego bloku. Co ważne zmienna w fazie wykonania jest równa `undefined`, aż do napotkania instrukcji przypisującej jej wartość. Spójrzmy na przykład poniżej:

```javascript
function foo() {
  console.log(x); // undefined
  var x = 10;
  console.log(x); // 10
}

foo();
```

W momencie wywołania funkcji `foo` i wejścia do nowego zakresu rozpoczyna się faza tworzenia. Silnik Javascript skanuje blok funkcji, w momencie napotkania deklaracji `var x = 10;` przypisuje zmiennej `x` wartość `undefined` i dodaje ją do obiektu `VariableEnvironment`. Będzie on wyglądał następująco:

```
VariableEnvironment = {
  x: undefined,
};
```

Dzięki temu, zmienna `x` dostępna jest w ramach tego bloku, jednak ma wartość `undefined`, aż do linii 3, gdzie następuje przypisanie wartości. Powyższy kod moglibyśmy przedstawić następująco:

```javascript
function foo() {
  var x = undefined;
  console.log(x); // undefined
  x = 10;
  console.log(x); // 10
}

foo();
```

Poniżej znajdziesz animację przedstawiającą przetworzenie wcześniej omówionego kodu przez silnik Javascript.

<figure style="width: 100%; margin-left: 0;">
  <a href="assets/hoisting.gif">  
    <img style="width: 100%" src="assets/hoisting.gif"/>
  </a>
  <figcaption>Wykorzystanie dwóch faz podczas przetwarzania kodu przez silnik Javascript</figcaption>
</figure>

Zanim przejdziemy do omówienia windowania dla funkcji, krótkie zadanie.

Co wyświetli się w konsoli i jaka będzie wyglądała struktura `VariableEnvironment` dla #1, #2 i #3 w poniższym kodzie:

```javascript
console.log("x is", x); // #1

var x;

console.log("x is", x); // #2

x = 5;

console.log("x is", x); // #3
```

Odpowiedź:

```javascript
console.log("x is", x); // #1 - undefined

var x;

console.log("x is", x); // #2 - undefined

x = 5;

console.log("x is", x); // #3 - 5

// VariableEnvironment for #1 i #2
VariableEnvironment = {
  x: undefined,
};

// VariableEnvironment for 3
VariableEnvironment = {
  x: 5,
};
```

## Wynoszenie funkcji

Jeśli chodzi funkcje proces jest podobny do tego ze słowem kluczowym `var`. Silnik Javascript podczas fazy tworzenia w momencie napotkania deklaracji funkcji umieszcza jej identyfikator w `VariableEnvironment` z przypisaną referencją do funkcji. Dzięki temu jest ona dostępna dla całego bloku w czasie fazy wykonywania. Przeanalizujmy poniższy kod:

```javascript
console.log(outer());

function outer() {
  console.log(inner());
  return "outer function";

  function inner() {
    return "inner function";
  }
}

// result:
// inner function
// outer function
```

Mamy tutaj do czynienia z dwoma zakresami, globalnym i funkcji. W każdym z nich występuje windowanie. Zanim zostanie wykonana pierwsza linijka skryptu, tworzony jest globalny kontekst wykonania. W fazie tworzenia kiedy silnik JS napotka deklarację funkcji `outer` jej identyfikator jest dodawany do `VariableEnvironment` dla globalnego kontekstu wykonania, dzięki czemu jest dostępna w całym bloku globalnym w następnej fazie. W tym momencie rozpoczyna się faza wykonania, w pierwszej linijce mamy wywołanie funkcji `console.log(outer());` . Oznacza to, że tworzony jest kontekst funkcji w ramach którego rozpoczyna się faza tworzenia, silnik JS w momencie napotkania deklaracji funkcji `inner` dodaje jej identyfikator do `VariableEnvironment` tyle że tym razem w ramach kontekstu wykonania dla funkcji `outer`. Struktura `VariableEnvironment` dla kontekstu globalnego i funkcji `outer` wygląda następująco:

```
// Global Execution Context
VariableEnvironment = {
	outer: <ref to function>
}

// outer Execution Context
VariableEnvironment = {
    inner: <ref to function>
}
```

## Deklaracja funkcji vs wyrażenie funkcyjne

Warto wspomnieć o różnicy między deklaracją (ang. Function Declaration), a wyrażeniem funkcyjnym (ang. Function Expression) w kontekście wynoszenia.

Zanim jednak przejdziemy do różnic, krótkie wytłumaczenie czym jest jedno i drugie:

- jeśli funkcja jest zadeklarowana jako osobna instrukcja rozpoczynająca się od słowa kluczowego `function` określamy to jako deklaracje funkcji
- jeśli funkcja tworzona jest jako część wyrażenia mówimy wtedy o wyrażeniu funkcyjnym. Przykładem może być tutaj przypisanie funkcji anonimowej do zmiennej które składa się z:
  1. utworzenia funkcji
  2. przypisania funkcji do zmiennej

```javascript
// function declaration
function foo() {
	console.log("Hello world!");
}

// function expression - creating the function is only one part of this expression
var foo = function() {
	console.log("Hello world!"):
}
```

Możesz zapamiętać, że deklaracja musi posiadać nazwę po słowie `function`, a wyrażenie funkcyjne nie, patrz kod powyżej.

Wynoszenie dla wyrażenia funkcyjnego działa analogicznie, do mechanizmu opisanego przy słowie kluczowym `var`. To znaczy kiedy silnik JS w fazie tworzenia napotka taka instrukcję, zmiennej przypisze wartość `undefined` i umieści jej identyfikator w `VariableEnvironment`. Oznacza to, że w fazie wykonania aż do momentu napotkania instrukcji przypisania wywołanie poprzez ten identyfikator zwróci błąd, `TypeError`, gdyż wartości `undefined` nie można wywołać.

```javascript
foo(); // Uncaught TypeError: foo is not a function

var foo = function() {
	console.log("Hello world!"):
}
```

## Słowa kluczowe `let` i `const`

Wprowadzone w ES6 słowa kluczowa `let` i `const` działają nieco inaczej w kontekście wynoszenia od wcześniej wspomnianego `var`. Zacznijmy od przykładu:

```javascript
console.log(a); // ReferenceError

let a = 10;
```

Jak widzimy w przeciwieństwie do słowa kluczowego `var` program pokazuje błąd, po którym jego wykonywanie zostanie przerwane. Czy to oznacza, ze wynoszenie dla `let` i `const` nie istnieje? Nie, **dla tych słów kluczowych wynoszenie wciąz występuje**, dowód ponizej:

```javascript
let a = 10;

{
  console.log(a); // ReferenceError
  let a = 10;
}
```

W przypadku braku windowania funkcja `console.log` w linii 3 powinna odnieść się do zmiennej z zewnętrznego bloku i wypisać `10`. Pytanie dlaczego nie dostajemy `undefined` jak w przypadku słowa kluczowego `var`, a błąd?
Odpowiedzialne jest za to **Temporal Dead Zone (TDZ)**. Możesz myśleć o tym jak o oknie czasowym w którym zmienna juz istnieje, ale nie została jeszcze zaincjalizowana i dlatego próba uzyskania do niej dostępu kończy się błędem.
Ciekawostką jest to, ze dla słowa kluczowego `var` TDZ równiez występuje jednak ma ona wartość zerową i dlatego nie zaobserwujemy tego w naszych programach.

W przykładowym kodzie poniżej zobrazowany jest TDZ w momencie wywołania funkcji `foo`.

```javascript
function foo() {
  // TDZ starts here

  // `a` is uninitialized:
  console.log(a); // ReferenceError

  let a; // TDZ ends
  console.log(a); // undefined
}
```

[Link](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/apA.md#whats-the-deal-with-tdz) jeśli chciałbyś dowiedzieć się więcej na temat TDZ, np. dlaczego został wprowadzony.

## Wykorzystanie wynoszenia w praktyce

Poznaliśmy koncepcję wynoszenia, oraz jej realizację w silniku Javascript. Czas odpowiedzieć sobie na pytanie czy ma ona jakieś zastosowanie praktyczne. Osobiście znalazłem tylko jedną, sensowną propozycję wykorzystania tego mechanizmu. Podał ją Kyle Simpson w książce "You Don't Know JS".

Dotyczy tylko funkcji i polega na dodaniu kod wykonywalnego zaraz na początku bloku, powyżej wszystkich deklaracji. Dzięki temu programista może łatwiej znaleźć kod odpowiedzialny za uruchomienie logiki w danym bloku. Jest to szczególnie przydatne, gdy deklaracje zajmowałyby dużo linii kodu i należałoby się przez nie "przescrollować", żeby znaleźć kod wykonywalny w tym bloku. Poniżej kawałek kodu obrazujący tę ideę:

```javascript
const students = getStudents();

doSomethingWithStudents(students);

// ************* - a lot of declarations here

function getStudents() {
  var whatever = doSomething();

  // other stuff

  return whatever;

  // ************* - a lot of declarations here

  function doSomething() {
    // ...
  }
}

function doSomethingWithStudents(); {
  // ...
 }
```

## Podsumowanie

W dzisiejszym artykule omówiliśmy sobie mechanizm wynoszenia. Wskazaliśmy różnicę pomiędzy koncepcją a krokami, jakie realizuje silnik Javascript, zobaczyliśmy, jak wygląda wynoszenie dla zmiennych i funkcji, oraz czy istnieją jakieś praktyczne zastosowania tego mechanizmu.

Jeśli miałbyś zapamiętać najważniejszą rzecz z tego artykułu, chciałbym, żeby była to różnica między koncepcją wynoszenia (przeniesienie deklaracji na górę bloku) a tym, jak faktycznie jest realizowana przez silnik Javascript (wykorzystanie fazy tworzenia do inicjalizacji zmiennych i udostępnienia ich w dla całego bloku w fazie wykonania).
