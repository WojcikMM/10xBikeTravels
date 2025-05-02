# Aplikacja - 10xBikeTravels (MVP)

## Główny problem

Planowanie angażujących wycieczek motocyklowych jest wyzwaniem. Istnieje wiele atrakcyjnych miejsc do odwiedzenia,
malowniczych widoków do zobaczenia oraz ekscytujących zakrętów do pokonania. Znalezienie i zaplanowanie interesującej
trasy jest czasochłonne. Motocykliści zazwyczaj unikają długich odcinków autostrad, preferując drogi bogate w zakręty
oraz oferujące piękne widoki - zarówno te podziwiane podczas jazdy, jak i te wymagające zatrzymania się. W
10xBikeTravels użytkownik określa swoje priorytety (np. najszybsza podróż, trasa widokowa, trasa z dużą liczbą zakrętów,
trasa uwzględniająca punkty warte odwiedzenia), planowany dystans oraz szacowany czas przejazdu, aby otrzymać dopasowaną
propozycję.

## Najmniejszy zestaw funkcjonalności (MVP)

* **System kont użytkowników:** Prosty mechanizm rejestracji i logowania, umożliwiający zapisywanie preferencji i
  wygenerowanych tras.
* **Profil użytkownika:** Strona, na której użytkownik może zdefiniować swoje podstawowe preferencje dotyczące stylu
  jazdy i typów tras (np. preferencja dróg krętych, widokowych, unikanie autostrad).
* **Generator tras (AI):** Mechanizm (oparty np. o algorytmy AI) generujący propozycje tras motocyklowych na podstawie
  kryteriów zdefiniowanych przez użytkownika (punkt startowy, preferencje, dystans/czas).
* **Zarządzanie trasami:** Możliwość przeglądania wygenerowanych propozycji tras na mapie, zapisywania wybranych tras na
  koncie użytkownika oraz ich usuwania. (Modyfikacja samej geometrii trasy wykracza poza MVP).

## Co NIE wchodzi w zakres MVP

* Udostępnianie wygenerowanych tras innym użytkownikom.
* Szczegółowy opis trasy zawierający zdjęcia czy opisy interesujących punktów na trasie.
* Funkcja śledzenia na żywo podczas pokonywania trasy.
* Zaawansowane planowanie uwzględniające dokładny czas przejazdu, punkty odpoczynku, stacje paliw czy rekomendacje
  noclegów.
* Analiza charakterystyki zakrętów (np. kąt, poziom trudności).
* Możliwość dodawania komentarzy, ocen czy zdjęć do tras.

## Kryteria sukcesu MVP

* Minimum 80% zarejestrowanych użytkowników uzupełniło swoje preferencje w profilu w ciągu pierwszego miesiąca od
  rejestracji.
* Minimum 60% aktywnych użytkowników generuje średnio co najmniej 1 trasę miesięcznie w ciągu pierwszych 3 miesięcy.
* Pozytywne opinie użytkowników (np. w ankietach) dotyczące trafności generowanych tras w odniesieniu do ich
  preferencji.