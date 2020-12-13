---
title: Implementacja async/await, czyli o generatorach, rekurencji i promise'ach
date: 2020-12-14
author: Michał Paczków
publish: true
description: Słowa kluczowe async/await są obecnie powszechnie używane w Javascript. Pozwalają na znaczne uproszczenie asynchronicznego kodu. W tym poście przyjrzymy się "magii" stojącej za nimi, implementując własną wersję. Będzie to doskonałe, praktyczne powtórzenie informacji o generatorach, promise oraz rekurencji.
image: assets/cover.jpg
imageCredit: "Zdjęcie: [Jeswin Thomas](https://unsplash.com/@jeswinthomas)"
categories:
  - Javascript
tags:
  - async/await
  - promise
  - generator
  - rekurencja
---

Tematy jakie ostatnio poruszyliśmy na blogu dotyczyły generatorów, oraz promise (przy okazji asynchroniczności). Przyszedł czas na podsumowanie tych zagadnień. Wiedzę najlepiej weryfikuje praktyka także dziś zaimplementujemy własną wersję `async/await`.

W ramach przypomnienia słowa kluczowe `async/await` pozwalają na uproszczenie asynchronicznego kodu. Dzięki nim kod asynchroniczny wygląda jak synchroniczny, co znacznie ułatwia jego poźniejsze analizowanie i utrzymanie. Z racji, że większość rzeczy w sieci odbywa się w sposób asynchroniczny, jest to istotny element języka Javascript.

Przykładem, mogą być dwa asynchroniczne zadania. Drugie z nich wymaga danych z pierwszego, więc należy je zsynchronizować:

```javascript
const asyncTask = () =>
  new Promise(resolve => setTimeout(() => resolve(1000), 1000));
const anotherAsyncTask = val =>
  new Promise(resolve => setTimeout(() => resolve(val * 2), 500));

asyncTask()
  .then(value => anotherAsyncTask(value))
  .then(result => console.log(result));

async function fetchData() {
  const data = await asyncTask();
  const result = await anotherAsyncTask(data);

  console.log(result);
}
```

Dla mnie funkcja `fetchData` jest bardziej czytelna. Mamy w niej rozdzielenie poszczególnych kroków zupełnie jak w kodzie synchronicznym, pozwala to w łatwy pobrać dane z jednego źródła i użyć ich w kolejnym.

> Po więcej informacji na temat asynchroniczności i async/await zapraszam do [tego postu](https://miscoded.io/pl/blog/asynchronicznosc-w-javascript/)

## Czy ta wiedza mi się przyda?

Niektórzy z Was mogą zadać sobie pytanie: "Czy to zadanie przyda mi się w mojej codziennej pracy?" Bardzo dobrze, już spieszę z odpowiedzią!

Obecnie `async/await` jest natywnie wspierany przez nowe przeglądarki, jeśli jednak przyjdzie Ci pracować w mniej przyjaznym środowisku takim jak jak starsze wersje przeglądarek czy wersji Node'a i pojawi się konieczność wykorzystania Babel'a, a w zależności od konfiguracji może on przetransformować `async/await` w generatory i promise'y, co oznacza, że warto wiedzieć jak to działa.

## Generator + Promise ~ async/await

Wracając do naszej implementacji `async/await` sprecyzujmy co chcemy uzyskać:

- funkcja oznaczona jako `async` **jest asynchroniczna dla kodu z zewnątrz**. W praktyce oznacza, że silnik Javascript nie będzie "czekać", aż ta funkcja zakończy się, tylko po jej wywołaniu przejdzie do następnych kroków
- wewnątrz funkcji kiedy przy prawej stronie słowa kluczowego `await` znajduje się `promise` **cały kod w funkcji jest wstrzymywany, aż do rozwiązania wspomnianego promise'a**

Funkcje te możemy zrealizować wykorzystując generator i rekurencję.

### Wykorzystanie generatora

Kluczowe do zaimplementowania własnego `async/await` są generatory, dzięki ich możliwościom:

- zatrzymania wykonywania funkcji po napotkaniu słowa kluczowego `yield`
- wznowienia, przesyłając jednocześnie dane do generatora (przypisanie do zmiennej znajdującej sie lewej stronie `yield`)

```javascript
function doTask() {
  return 123;
}

function* gen() {
  const a = yield doTask();
  yield a * 2;
}

const generator = gen();
generator.next(); // { done: false, value: 123 }
generator.next(10); // { done: false, value: 20 }
generator.next(); // { done: true, value: undefined }
```

W powyższym przykładzie stworzyliśmy generator, po czym go uruchomiliśmy (wykonanie funkcji aż do wystąpienia `yield`) i dostaliśmy obiekt `{done: false, value: 123}`. Atrybut `done` informuje o dotarciu do końca funkcji (wykonaniu ostaniego kroku). Jeśli osiągneliśmy koniec funkcji jego wartość jest równa `true`.

Następnie wznawaimy wykonanie funkcji, jednocześnie przesyłając wartość `10` (do zmiennej `a`). Wartość ta pomnożona przez 2 jest zwrócona po napotkaniu kolejnego `yield`.

Funkcję wznawaimy jeszcze raz, tym razem nie ma już zadnych kroków do wykonania przez co zwracany jest obiekt `{done: true, value: undefined}`.

> Jeśli nie do końca jest jasne dla Ciebie co się dzieje w powyższym przykładzie [tutaj](https://miscoded.io/pl/blog/generatory-jak-i-po-co-zatrzymac-funkcje/) znajdziesz więcej informacji na temat generatorów.

Chcąc naśladować funkcjonalność `async/await` musimy dodać obsługę zadań asynchronicznych. Mogłoby to wyglądać następująco:

```javascript
const asyncTask = () =>
  new Promise(resolve => setTimeout(() => resolve(1000), 1000));

function* fetchData() {
  const data = yield asyncTask();
  console.log(data);
}
```

Oczywiście powyższy kod nie zadziała poprawnie, potrzebny jest nam do tego jeszcze jeden element, mechanizm który:

- odpali funkcję generatora
- wznowi wykonywanie funkcji, z uwzględnieniem jednej zasady: _jeśli po prawej stronie `yield`, który wstrzymał funkcję znajduje się `promise`, mechanizm wznowi wykonywanie funkcji dopiero po jego rozwiązaniu_

Rozwiązanie z uwzględnienim powyższych funkcjonalności będzie opierało się o rekurencję, dlatego przedstawię krótko to podejście (jeśli je znasz, możesz pominąć czytanie następnego podrodziału).

### Rekurencja

Rekurencja to najkrócej mówiąc wywoływanie funkcji przez samą siebie (trochę jak w Incepcji zasypianie we śnie). Jest to mocno abstrakcyjne pojęcie, dlatego rozważmy to na przykadzie spoza świata programistycznego - prezentów.

Wyobraź sobie, że dostajesz prezent na urodziny, jednak jest on zapakowany w pudełko, które jest zapakowane w większe pudełko itd.

Chcąc dostać się do prezentu, otwierasz największe pudło i jeśli:

- zawiera ono prezent - kończysz otwieranie pudełek
- zawiera kolejne, mniejsze pudełko - wracasz na początek i znów otwierasz pudełko

Widzimy tutaj dwa przypadki:

- kiedy w pudełku nie ma prezentu - jest to przypadek rekurencyjny, powtarzający się. Kiedy jest on prawdziwy, musisz ponownie otworzyć pudełko i sprawdzić, czy jest prezent (czyli powtarzasz tę samą operację)
- kiedy w pudełku jest prezent - to przypadek stopu/podstawowym, w którym nie wykonujesz kolejnego wywołania (kończysz wykonywanie funkcji rekurencyjnej), unikając w ten sposób pętli nieskończonych wywołań

Kod dla powyższego przykładu:

```javascript
function checkBox(box) {
  const gift = box.getGift();
  if (gift !== null) {
    // base/stop case
    return gift;
  }
  const nextBox = box.open();
  checkBox(nextBox); // recurssion case
}
```

Rekurencja innymi słowy jest sposobem wykonywania operacji na zbiorze wartości, gdzie każda wartość jest powiązana z poprzednią, bez używania w niej iteracji lub pętli.

Pamiętaj, że każde rozwiązanie rekurencyjne, można zaimplementować za pomocą iteracji, jednak rekurencja w pewnych przypadkach pozwala znaczenia uprościć kod i to wykorzystamy w naszym rozwiązaniu.

<figure style="display: flex; flex-direction: column;">
  <iframe src="https://gifer.com/embed/g2PD" width="100%" style="min-height: 300px;" frameBorder="0" allowFullScreen></iframe>
  <figcaption>Przykład rekurencji (bez przypadku stopu)(via GIFER)</figcaption>
</figure>

### Uruchomienie generatora i pętla zwrotna

Znając już mechanizm rekurencji oraz to jak działają generatory oraz promise'y spójrzmy na poniższy kod:

```javascript
function runner(genFunction) {
  const generator = genFunction(); // #1 - create a generator

  function nextStep(value) {
    const step = generator.next(value); // #2 start or resume function until next yield

    if (step.done) {
      return; // #3 - stop recursive callings
    } else {
      if (typeof step.value.then === "function") {
        // if step.value is Promise, wait to resolve and go to next step
        const promise = step.value;
        promise.then(data => {
          nextStep(data); // #4 - resolve promise and pass data to the next step
        });
      } else {
        nextStep(step.value); // #5 - just past data to the next step
      }
    }
  }

  nextStep(); // run function, set promise and go ahead
}
```

Funkcja ta jako argument przyjmuje funkcje generatora, z której tworzy generator [#1]. `runner` definuje w sobie funkcję `nextStep`, powoduje ona rozpoczęcie, bądź wznowienie wykonywania funkcji powiązanej z generatorem, aż do napotkania słowa kluczowego `yield` [#2].

W momencie napotkania `yield` funkcja generatora zwraca wykonywanie kodu do `nextStep`.

Na początku sprawdzane jest, czy był to ostani krok funkcji `step.done`.

Jeśli tak wykonywanie funkcji kończy się (jest to krok podstawowy dla rekurencji) [#3], w przeciwnym wypadku:

- jeśli wartość aktualnego kroku to promise (warunek: `typeof step.value.then === "function"`), czekamy, aż nastąpi rozwiązanie tego promise'a, następnie wywołujemy rekurecyjnie funkcję `nextStep` [#4], żeby przejść do następnego kroku
- jeśli to nie promise, od razu następuje wywołanie rekurencyjne (nie musimy na nic czekać) [#5]

Funkcja `runner` jest brakującym elementem, ktory odpala funkcję generatora, a po napotkaniu `yield` funkcja `runner` jest odpowiedzialna za przetworzenie wartości zwróconej z funkcji generatora (jeśli to `promise` to odczekanie, aż do rozwiązania) i wznowieniu funkcji generatora przekazując wartość z ostaniego kroku:

```javascript
function asyncTask {
  return setTimeout((resolve) => resolve(1000),0)
}

runner(function* () {
  const data = yield asyncTask();
  const result = data * 2;
  console.log(result); // 2000
});

console.log("This is the first statment in console.log");
```

Rezultatem wykonania powyższego kodu w konsoli będzie:

```
This is the first statment in console.log
2000
```

Oznacza to, że wykonaliśmy nasze założenia:

- zatrzymanie wykonywania funkcji po napotkaniu słowa kluczowego `yield`
- wznowienie, przesyłając jednocześnie dane do generatora (przypisanie do zmiennej znajdującej sie lewej stronie `yield`)

Pełną wersję znajdziesz [tutaj](https://codesandbox.io/s/async-await-37vuq)

https://codesandbox.io/s/async-await-37vuq

Oczywiście jest to uboga wersja funkcji zaimplementowanej np. przez Babel'a, nie zwracamy tutaj nic w ostatnim kroku przez co funkcja nie może być użyta jako `promise` w innym miejscu w kodzie.

To już jednak Twoje zadanie domowe. Jeśli jesteś ciekawy jak wygląda odpowiedni funkcji `runner` w Babel sprawdź ją [tutaj](https://babeljs.io/en/repl#?browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=MYewdgzgLgBAhhAnmYAVBBrGBeGYCmA7jAAoBOIAtgJYT4AU9Z-EIANgG74CUOAfDDpRU1SvhABXKI17YBzVpwYBGAAyruAGgCs67twDcAKCMJkwGADMJKKNXBWQIerwDeRgJChIsODniEcNS-SCjoEBguxgC-RkA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2017&prettier=true&targets=&version=7.12.9&externalPlugins=).

## Podsumowanie

- `async/await` jest obecnie szeroko używany w rozwiązaniach zawierających kod asynchroniczny, pozwala na jego uproszczenie
- w starszych przeglądarkach jest on niewspierany, a przy pomocy Babel'a może zostać przekształcony na rozwiązanie używające generatorów i promise'ów
- własne `async/await` można zaimplementować wykorzystując do tego generatory oraz rekurencję
