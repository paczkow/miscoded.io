---
title: Jak zyskać elastyczność dzięki wstrzykiwaniu zależności?
date: 2020-10-13
author: Michał Paczków
description: ""
image: assets/cover.jpg
imageCredit: "Zdjęcie: [Alessandro Vallainc](https://unsplash.com/@sandronize)"
categories:
  - Javascript
  - Wzorce projektowe
tags:
  - odwrocenie-sterowania
  - refactoring
  - react
---

Wzorce projektowe to bardzo istotny element tworzenia oprogramowania, są gotowym rozwiązaniem na często występujące problemy. Lubię myśleć o wzorcach jak o narzędziach. Czasem się przydadzą, czasem nie, a w większość sytuacji potrzebujemy tylko kilka z nich. Dziś o narzędziu, które należy do wspomnianej grupy, jest szeroko używane w wielu rozwiązaniach - wzorzec obserwatora _(ang. Observer)_.

Często nie zdajemy sobie sprawy jak często go wykorzystujemy. Chcesz zapisać się do newsletter'a? Może czekasz na informację o statusie Twojego zamówienia? Te przykłady wykorzystują obserwator.

Przeanalizujmy dokładniej jeszcze jeden przykład, paczkomaty. Wcześniej należało czekać za listonoszem lub kurierem, który przynosił paczkę do domu, teraz sytuacja się odwróciła i to Ty odbierasz paczkę. Reagujesz na informację o statusie Twojego zamówienia, jesteś obserwatorem.

Dzięki odwróceniu sytuacji zyskujemy na swobodzie, możemy odebrać paczkę w dogodny dla nas momencie.

Widzisz tutaj jakiś koncept? Podpowiem: odwrócenie sterowania. Wzorzec obserwatora jest właśnie przykładem tego konceptu. Jeśli chcesz dowiedzieć sie więcej o odwróceniu sterowania i korzyściach z niego płynących zapraszam [tutaj]().

## Co mają wspólnego Hollywood i programowanie?

Jeśli przeczytałeś wspomniany artykuł wiesz, że pomocne okażą się dwa pytania:

- Jak wygląda domyślny proces i co można odwrócić?
- Jakie korzyści przyniesie odwrócenie?

Jak to ma się do obserwatora?

Bardzo często w kontekście odwrócenia sterowania używa się zasady Hollywood: **“Don’t Call Us, We’ll Call You.”**

![Hmm ciekawe czy zadzwonią...](assets/hollywood-principle.png)

Przenealizujmy przykład bazując na tej zasadzie.

Pewne studio robi casting do filmu. Zgłosiły się setki kandydatów. Każdemu z nich bardzo zależy na roli w filmie, czy w związku z tym powinien co 5 minut dzwonić do studia i pytać o wyniki?

Nie jest do dobre podejście zarówno z perspektywy kandydata (jest zajęty telefonami) jak i studia (musi odbierać telefony). To jest nasz domyślny proces. Jak możemy go usprawnić?

**Należy odwrócić sterowanie**, to nie aktorzy będą dzownić i dopytywać się o angaż, tylko **studio poinformuje zainteresowanych o wynikach** ("Nie dzwoń do nas, to my zadzwonimy do Ciebie").

Każda ze stron zyskuje czas i swobodę dzięki takiemu podejściu. Przeanalizujmy schemat pozwalający odwrócić ten proces.

![Schemat obserwatora, przykład odwrócenia sterowania](assets/observer-pattern.png)

Studio zatrudniło managera odpowiedzialnego za wybranie kandydatów do castingu, a następnie spośród kandydatów aktorów do filmu. Jego odpowiedzialności to:

- zarządzadzanie listą potencjalnych kandydatów
- informowanie kandydatów o wszystkich aktualnieniach dotyczących obsady

Odpowiedzialnością aktora jest tylko reakcja na informację, które otrzymał od managera. Oto cały wzorzec obserwatora! Uogólnijmy go i dodajmy definicje.

## Definicja wzorca obserwatora

> _"Obserwator to czynnościowy (behawioralny) wzorzec projektowy pozwalający zdefiniować mechanizm subskrypcji w celu powiadamiania wielu obiektów o zdarzeniach dziejących się w obserwowanym obiekcie."_ - Aleksander Shvets

Obserwator składa się z obiektu obserwowanego (Subject), która zarządza listą subskrybentów (Observers) i powiadamia ich o zdarzeniach. W naszym przykładzie Subject to Manager, a lista subskrybentów to Aktorzy.

**Dzięki temy wzorcowi, możemy zdefiniować zależności jeden do wielu między obiektami bez ich ścisłego łączenia.**

W naszym przykładzie oznacza to, że dla Managera każdy obiekt, który posiada funkcję `update` może zostać potencjalnym subskrybentem. Dzięki temu w łatwy sposób, będzie można rozszerzyć wybór o muzyków czy kaskaderów.

[Tutaj](https://codesandbox.io/s/movie-casting-2u08e) możesz zobaczyć kod powiązany z powyższym schematem.

https://codesandbox.io/s/movie-casting-2u08e

## Obserwator w React

Czas na praktykę! Przeanalizujmy wzorzec obserwatora w React. W tym celu stworzyłem prostą aplikację pokazującej pogodę dla poszczególnych miast Polski w wersji podstawowej (tylko temperatura) i szczegółowej.

Jej funkcjonalności to:

- lista z miastami z przypisanymi do nich temperaturami
- z listy można wybrać miasto, aby dostać szczegółowe dane o pogodzie (zachmurzenie itd.)

Zacznijmy od stworzenia obiektu `WeatherSubject` będzie on zarządzał listą widgetów i do nich wysyłał aktualizacje dotyczące pogody.

```jsx
export class WeatherSubject {
  basicWidgets = [];
  detailWidgets = [];
  isNotyfing = false; // TODO: zmiast flagi patrzec po length

  addWidget(callback, city, mode) {
    console.log(`New widget to subscribe: ${city} - (${mode} mode)`);
    if (mode === "detail") {
      this.detailWidgets.push({ city, callback });
    } else {
      this.basicWidgets.push({ city, callback });
    }

    if (!this.isNotyfing) {
      this.isNotyfing = this.notify();
    }
  }

  removeWidget(city, mode) {
    console.log(`Remove widget from subscribers: ${city} - (${mode} mode)`);
    if (mode === "detail") {
      this.detailWidgets = this.detailWidgets.filter(w => w.city === city);
    } else {
      this.basicWidgets = this.basicWidgets.filter(w => w.city === city);
    }

    if (this.basicWidgets.length + this.detailWidgets.length < 1) {
      clearInterval(this.isNotyfing);
      this.isNotyfing = false;
    }
  }

  notify() {
    return setInterval(() => {
      const data = fetchWetherData();

      this.basicWidgets.forEach(({ city, callback }) => callback(data[city]));
      this.detailWidgets.forEach(({ city, callback }) => callback(data[city]));
    }, 1000);
  }
}
```

Widzimy tutaj obiekt, który zarządza listą widgetów podstawowych i szczegółowych. Pozwala on na dodanie (`addWidget`) i usunięcie (`removeWidget`) pojedynczego widgetu jak i poinformowanie dodanych widgetów o aktualnym stanie pogody (`notify`).

W tym przypadku robię to co sekunde (pogoda zmienia się baaardzo dynamicznie) używając funkcji `setInterval`.

Do zakończenia odliczenia interwałów (w przypadku pustej list widgetów) używam flagi `isNotyfing` wraz z funkcją czyszczącą `clearInterval`.

Przejdźmy do widgetu. Jest to komponent, który regauje na zdarzenia jakie otrzyma od `WeatherSubject`. W tym przykładzie "reakcją" jest to re-render z aktualnymi wartościami.

```jsx
import React, { useEffect, useState } from "react";

import { WeatherSubject } from "./weather-subject";

export const Widget = ({ id, cityName, showDetail }) => {
  const [currentTemprature, setCurrentTemprature] = useState();

  const onTempratureUpdated = ({ temperature }) => {
    setCurrentTemprature(temperature);
  };

  useEffect(() => {
    weatherSubject.addWidget(onTempratureUpdated, city, "basic");

    return () => weatherSubject.removeWidget(city, "basic");
  }, []);

  return (
    <div className="widget" onClick={() => showDetail({ id, cityName })}>
      <span className="widget__name">{name}</span>
      <span className="widget_temprature">{currentTemprature || "-"}&deg;</span>
    </div>
  );
};
```

Widzimy tutaj wykorzystanie hook'a `useEffect`. W momencie zamontowania komponentu, jest do dodawany do listy subskrybentów. Dodanie do listy subskrybentów polega na przesłaniu callback'a - funkcji ustawiającej stan komponentu.
Dzięki temu, będzie otrzymywał nowe dane dotyczące pogody co sekundę. W momencie usuwania komponentu odpinamy go z listy obserwatorów.

Wigdet ze szczegółami jest bardzo podobny, dlatego pominę jego opis. Tutaj znajdziesz [cały omówiony kod](https://codesandbox.io/s/weather-preview-lk71c).

https://codesandbox.io/s/weather-preview-lk71c

## Przykłady zastosowania w popularnych rozwiązanich

### RxJS

Zastosowanie wzorca obserwatora spotkamy w RxJs. Przykładem może być generowanie wartości co sekundę. Mamy tutaj `source` nasz Subject oraz `subscribe` naszego subskrybenta, który wyświetla odebraną wartość w konsoli.

```javascript
import { interval } from "rxjs";

//emit value in sequence every 1 second
const source = interval(1000);
//output: 0,1,2,3,4,5....
const subscribe = source.subscribe(val => console.log(val));
```

### react-redux

Funkcja `connect` w bibliotece `react-redux` stosuje wzorzec obserwatora, komponentu są tu subskrybentami, które reagują na zmiany powiązane z nimi części drzewa stanu. Więcej [tutaj](https://engineering.zalando.com/posts/2016/08/design-patterns-redux.html)

## Podsumowanie

- obserwator jest jednym z najczęściej używanych wzorców projektowych
- jest on szczególnie przydatny jeśli chcemy zdefiniować zależności **jeden do wielu** między obiektami bez ich ścisłego łączenia
- wzorzec obserwatora składa się on z:
  - obiektu `Subject`, która zarządza listą subsrybentów i wysyła aktualności,
  - listy obiektów obserwujących `Observers` odbierających aktualizacje od `Subject`
- obserwator jest obecny w wielu popularnych rozwiązaniach np. RxJs czy Redux

A na koniec tego artykułu jeszcze jeden filmowy przykład. Co może się stać kiedy ktoś nie zna obserwatora...

https://www.youtube.com/watch?v=basofea2UEs&t=25
