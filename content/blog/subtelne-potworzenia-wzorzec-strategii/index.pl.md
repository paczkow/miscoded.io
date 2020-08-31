---
title: Subtelne powtórzenia i jak je zwalczać (2/2). Wzorzec strategii
date: 2020-08-31
author: Michał Paczków
publish: true
description: ""
image: assets/cover.jpg
imageCredit: "Zdjęcie: [Cyril Saulnier](https://unsplash.com/@c_reel)"
categories:
  - Javascript
  - Wzorce projektowe
tags:
  - refactoring
---

Witam Cię w drugiej części mini serii poświęconej usuwaniu powtórzeń. [W poprzednim poście](https://miscoded.io/pl/blog/subtelne-powtorzenia-polimorfizm/) przedstawiłem przykłady subtelnych powtórzeń oraz możliwości ich usunięcia przy użyciu polimorfizmu, dziś rozszerzymy temat o wzorzec strategii.

Przypomnijmy, że subtelnymi powtórzeniami są:

- łańcuchy instrukcji `switch-case` lub `if-else`, które występują wielokrotnie w różnych miejscach w kodzie, zawsze z tym samym zbiorem warunków
- moduły, które mają podobne algorytmy, ale nie mają podobnego kodu - inaczej mówiąc moduł zawiera pewną listę kroków, jednak w zależności od typu implementacja kroków jest inna

W ramach dzisiejszego postu stworzyłem mała aplikację w React, która pozwala na stworzenie konfiguracji z pól formularza (imię, nazwisko, wiek).

Konfiguracja taka, może występować w 2 formatach: _json_ i _csv_.

Sama aplikacja składa się z następujących komponentów:

- formularza do wypełnienia danych konfiguracji `Config`
- wyboru formatu `Format`
- komponentów, które pozwalają podejrzeć `Preview` i wyeksportować `Export` konfigurację w konkretnym formacie

```jsx
import React, { useState } from "react";

import { Config, Format } from "./Forms";
import { Preview } from "./Preview";
import { Export } from "./Export";

import "./styles.css";

export default function App() {
  const [values, setValues] = useState({ name: "", surname: "", age: "" });
  const [format, setFormat] = useState("json");

  return (
    <div className="App">
      <div>
        <Config values={values} setValues={setValues} />
        <Format value={format} setFormat={setFormat} />
      </div>
      <div>
        <Preview format={format} data={values} />
        <br />
        <Export format={format} data={values} />
      </div>
    </div>
  );
}
```

Skupmy się na 2 ostatnich komponentach:

```jsx
/* preview.jsx */
export const Preview = ({ format, data }) => {
  let code = null;
  // highlight-start
  switch (format) {
    case "csv":
      code = <pre className="csv">{generateCSV(data)}</pre>;
      break;
    default:
      code = <pre className="json">{generateJson(data)}</pre>;
  }
  // highlight-end

  return <div>{code}</div>;
};

/* export.jsx */
export const Export = ({ format, data }) => {
  const exportData = () => {
    // highlight-start
    switch (format) {
      case "csv":
        // ...here do some additional steps to export CSV...
        console.log("Do some steps to export CSV");
        alert(generateCSV(data));
        break;
      default:
        // ...here do some additional steps to export JSON...
        console.log("Do some steps to export JSON");
        alert(generateJson(data));
    }
    // highlight-end
  };
  return (
    <div>
      <button onClick={() => exportData()}>Export configuration</button>
    </div>
  );
};
```

W każdym z nich widzimy ten sam zbiór warunków, opierający się na typie formatu. Jeśli czytałeś poprzedni post wiesz, że takie rozwiązanie będzie problematyczne w utrzymaniu.

Z każdym nowym formatem będziemy musieli zmieniać każda powiązaną instrukcję `switch`. Tutaj są to tylko 2 miejsca, ale w zaawansownej aplikacji byłoby ich zdecydowanie więcej. Jak rozwiązać to lepiej?

Widzimy, że w zależności od typu formatu generowana jest odpowiednia konfiguracja np. `generateCsv`, a następnie wykonywane jakieś dodatkowe kroki.

Moglibyśmy zastąpić każdą z instrukcji `switch` odpowiednią funkcją realizującą konkretną logikę np. `export`, `preview` i zamknąć w nich generowanie danych wraz z dodatkowymi krokami.

Skąd jednak funkcję mają wiedzieć, kiedy wygenerować konfigurację w _csv_, a kiedy w _json_?

Umieścilibyśmy je w odpowiednich klasach odpowiadających formatom np. `FormatCsv` czy `FormatJson` i w nich zaimplementowali szczegóły dotczyącego każdego formatu.

Jednak gdzie będzie znajdować się logika, która połączy wybranie odpowiedniego formatu z wykorzystaniem konkretnej klasy?

Potrzebujemy do tego jeszcze jedną klasę, która będzie zarządzać formatami. Nazwijmy ją `FormatContext`. To z nią będa się komunikować inne części systemu i dzięki niej wybierzemy i podmienimy używany format w czasie działania programu. To co właśnie przedstawiłem to wzorzec strategii.

![Schemat wzorca strategii na przykładzie formatów](assets/strategy-pattern.png)

Na powyższym schemacie widzisz dodatkowo interfejs `Format`. Jest on niezbędny w językach statycznie typowanych do określenia zbioru wspólnych funkcji. W Javascript, gdzie możemy przesłać dowolny obiekt bez sprawdzania typu nie ma takiej potrzeby.

## Wzorzec strategii, czyli "jak grać panie trenerze?"

Czym jest jednak ten wzorzec?

_Wzorzec strategi to wzorzec behawioralny opisujący pewne zachowania. Umożliwia on wybór algorytmu w czasie wykonywania programu. Kluczową ideą jest tworzenie obiektów reprezentujących konkretne strategie. Obiekty te tworzą zbiór strategii spośród których obiekt kontekstu może wybierać i odpowiednio zmieniać swoje zachowanie zgodnie z zastosowaną strategią._

Zanim jednak przejdziemy do kodu krótka analogia do piłki nożnej. W tej dyscyplinie występuje wiele różnych taktyk:

- 4-4-2
- 4-3-3
- 4-1-2-3-1

Dla drużyny (_obiekt kontekstu_) dobierana jest odpowiednia taktyka (_alogrytm_), która potem jest realizowana w większym czy mniejszym skutkiem. Ważne jest, że taktyka może ulec zmianie w czasie meczu np. w zależności od wyniku.

<figure style="width: 100%; margin-left: 0;">
  <a href="assets/formations.gif">  
    <img style="width: 100%" src="assets/formations.gif"/>
  </a>
  <figcaption>Rożne strategie gry zespołu</figcaption>
</figure>

## Wzorzec strategii, a uniknięcie powtórzeń

Wracając do naszego przykładu, przypomnijmy, że chcemy stworzyć zbiór strategii bazujących na formatach. W zależności od przyjętej strategii inaczej zostanie zrealizowany podgląd oraz eksport.

Wybrana strategia będzie realizowana poprzez obiekt konteksu.

Zdefinujmy zbiór strategi, oraz obiekt kontekstu:

```javascript
export class FormatJson {
  type = "json";

  export(data) {
    // ...here do some additional steps to export JSON...
  }

  generate(data) {
    // ...here logic to generate JSON...
  }
}

export class FormatCSV {
  type = "csv";

  export(data) {
    // ...here do some additional steps to export CSV...
  }

  generate(data) {
    // ...here logic to generate CSV...
  }
}

export class FormatContext {
  setFormat(format) {
    console.log(format);
    this.format = format;
  }

  preview(data) {
    const { type, generate } = this.format;
    return <pre className={type}>{generate(data)}</pre>;
  }

  export(data) {
    this.format.export(data);
  }
}
```

Mamy tu implementację różnych strategii dotyczących formatów. W każdej z klas związanej z konkretnym formatem mamy funkcję implementujące eksport i podgląd. Dzięki temu możemy ukryć szczegóły przed innymi częściami systemu, co zmniejszy liczbę miejsc które trzeba będzie modyfikować np. dodając nowy format.

Oprócz tego mamy obiekt kontekstu do którego można przesłać jedną ze strategii, a następnie zostanie ona zrealizowana poprzez ten obiekt (funkcje `preview` i `export`).

`FormatContext` przekazujemy zarówno do komponentu `Export` jak i `Preview`.

```jsx
/* export.jsx */
export const Export = ({ contextFormat, data }) => {
  const exportData = () => {
    contextFormat.export(data);
  };

  return (
    <div>
      <button onClick={() => exportData()}>Export configuration</button>
    </div>
  );
};

/* preview.jsx */
export const Preview = ({ contextFormat, data }) => {
  return <div>{contextFormat.preview(data)}</div>;
};
```

Szczegóły dotyczące formatów zostały ukryte dzięki czemu komponenty bardzo się zmniejszyły. Pozostaje nam już tylko stworzyć obiekt kontekstu i przekazać go do komponentów:

```jsx
/* configuration strategies  */
const formats = {
  json: new FormatJson(),
  html: new FormatHTML(),
  csv: new FormatCSV(),
};

/* configurations context */
const context = new ContextFormat();

export default function App() {
  const [values, setValues] = useState({ name: "", surname: "", role: "" });
  const [type, setType] = useState("json");

  /* set specific strategy - configuration */
  context.setFormat(formats[type]);

  return (
    <div className="App">
      <div>
        <Config values={values} setValues={setValues} />
        <Format selectedType={type} setType={setType} />
      </div>
      <div>
        <Preview format={context} data={values} />
        <br />
        <Export format={context} data={values} />
      </div>
    </div>
  );
}
```

Z racji, że to aplikacja napisana w React, zamiast tworzyć obiekt `ContextFormat`, możemy wykorzystać `createContext`. Zapraszam tutaj do sprawdzenia przykładu wykorzystującego `React.context`.

Główną zaletą tej refaktoryzacji jest ukrycie logiki powiązanej z formatami, węwnątrz odpowiednich klas. Teraz, chcąc dodać kolejnym format nie będziemy musieli edytować naszego kodu w wielu miejscach wystarczy dodać nową klasę - strategię np. `HTMLFormat` i rozszerzyć obiekt `formats` o nowy typ.

## Kalkulacja i refaktorzyacja, nie odwrotnie

Wzorce projektowe (strategi nie jest tu wyjątkiem) są tylko pewnymi narzędziami do rozwiązywania problemów. Przed użyciem należy rozważyć zastosowanie tego narzędzia. Czy jego użycię będzie miało więcej plusów niż minusów?

Minusami takiego rozwiązania jest większa złożoność należy dodać choćby klasę pośredniczącą `Context`, dodatkowo inne osoby w zespole powinny znać ten wzorzec, żeby rozumieć co dzieje się w kodzie.

## Podsumowanie

Jak pisałem w poprzednim poście tej mini serii "Powtórzenia to nie tylko fragementy identycznego kodu. Często kryją się pod instrukacjami `if-else` i `switch-case` rozsianymi po całej aplikacji." Dziś poznaliśmy wzorzec strategii, które pomoże w usunięciu tego rodzaju powtórzeń.

Jest on szczególnie przydatny w przypadku kiedy mamy kilka modułów składających się z tych samych kroków, ale kroki powinny być zaimplmentowane w inny sposób w każdym z modułów.

Pamiętaj, że nie jest to złoty środek, przed zastosowaniem jakiegkolwiek wzorca należy rozważyć plus i minusy jego użycia. Tylko wtedy będzie w stanie podnieść jakość naszego kodu.
