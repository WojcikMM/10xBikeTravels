# Dokument wymagań produktu (PRD) - 10xBikeTravels (MVP)

## 1. Przegląd produktu

10xBikeTravels to aplikacja webowa (PWA) w wersji Minimum Viable Product (MVP), której celem jest pomoc motocyklistom w
planowaniu angażujących wycieczek. Aplikacja generuje propozycje tras na podstawie preferencji użytkownika (styl jazdy,
typ trasy), punktu startowego, planowanego dystansu lub czasu podróży. W wersji MVP główny mechanizm generowania tras
opiera się eksperymentalnie na modelu językowym (LLM), a trasy prezentowane są w formie tekstowej listy punktów (format
JSON), bez wizualizacji na mapie. Użytkownicy mogą zakładać konta, zapisywać swoje preferencje w profilu oraz
zarządzać (zapisywać, przeglądać, usuwać) wygenerowanymi trasami. Ze względu na eksperymentalny charakter generowania
tras za pomocą LLM, użytkownicy będą informowani o potencjalnych niedokładnościach i ograniczeniach tego podejścia w
wersji MVP.

## 2. Problem użytkownika

Planowanie interesujących i spersonalizowanych wycieczek motocyklowych jest procesem czasochłonnym i wymagającym.
Motocykliści często poszukują tras, które oferują więcej niż tylko najszybsze połączenie między punktami A i B.
Preferują drogi bogate w zakręty, malownicze widoki (góry, jeziora, wybrzeże, lasy, łąki, kaniony) i unikają monotonnych
autostrad. Standardowe narzędzia nawigacyjne nie zawsze uwzględniają te specyficzne potrzeby, co utrudnia znalezienie i
zaplanowanie trasy idealnie dopasowanej do oczekiwań motocyklisty. Istnieje potrzeba narzędzia, które upraszcza ten
proces, dostarczając spersonalizowane propozycje tras na podstawie zdefiniowanych priorytetów.

## 3. Wymagania funkcjonalne

### 3.1. System kont użytkowników

    - Użytkownik może zarejestrować nowe konto podając podstawowe dane (np. email, hasło).
    - Użytkownik może zalogować się do istniejącego konta.
    - System zapewnia podstawowe bezpieczeństwo haseł.

### 3.2. Profil użytkownika

    - Użytkownik ma dostęp do sekcji profilu po zalogowaniu.
    - Użytkownik może zdefiniować i zapisać swoje preferencje dotyczące stylu jazdy: wybór jednego głównego priorytetu trasy (np. trasa widokowa, trasa kręta, unikanie autostrad). Akceptowane typy widoków dla trasy widokowej: góry, jeziora, wybrzeże, obszary leśne, łąki, kaniony.
    - Użytkownik może zdefiniować i zapisać informacje o swoim motocyklu: typ, pojemność, moc, rocznik.
    - Dane motocykla mogą wpływać na sugestie tras (np. sugerowanie krótszych tras dla motocykli o mniejszej pojemności).
    - Użytkownik może modyfikować zapisane preferencje i dane motocykla.

### 3.3. Generator tras (LLM)

    - Funkcjonalność dostępna dla zalogowanych użytkowników.
    - Użytkownik podaje punkt startowy jako tekst (adres, nazwa miejscowości, punkt orientacyjny).
    - Użytkownik wybiera główny priorytet trasy (zgodny z preferencjami lub nadpisany dla konkretnego zapytania).
    - Użytkownik określa planowany dystans lub szacowany czas przejazdu.
    - Aplikacja wysyła zapytanie do modelu LLM, uwzględniając punkt startowy, preferencje z profilu (styl jazdy, dane motocykla), wybrany priorytet, dystans/czas oraz ograniczenie geograficzne.
    - Mechanizm generowania tras działa wyłącznie w oparciu o LLM, bez wykorzystania zewnętrznych API mapowych czy routingowych.
    - Generowanie tras jest ograniczone geograficznie do Polski.
    - Należy opracować strategię prompt engineeringu w celu optymalizacji zapytań do LLM.
    - Użytkownik jest informowany o eksperymentalnym charakterze generowania tras i potencjalnych niedokładnościach.

### 3.4. Prezentacja trasy

    - Wygenerowana trasa jest prezentowana jako lista punktów w formacie JSON.
    - Każdy punkt w JSON zawiera co najmniej pole `text` z opisem tekstowym. Opcjonalnie może zawierać współrzędne geograficzne (`latitude`, `longitude`). Należy sfinalizować dokładną strukturę JSON.
    - Oprócz listy punktów, LLM generuje również krótki tytuł i podsumowanie dla każdej trasy.
    - W MVP nie ma komponentu mapy do wizualizacji trasy. Interfejs umożliwia łatwe skopiowanie wygenerowanej listy punktów (JSON).
    - Należy zaprojektować interfejs użytkownika do przeglądania tekstowych tras (tytuł, podsumowanie, lista punktów).

### 3.5. Zarządzanie trasami

    - Użytkownik może zapisać wygenerowaną trasę (lista punktów JSON, tytuł, podsumowanie) na swoim koncie. Wraz z trasą zapisywane są również parametry wejściowe użyte do jej wygenerowania.
    - Użytkownik ma dostęp do listy swoich zapisanych tras, prezentowanych z tytułami i podsumowaniami.
    - Użytkownik może wyświetlić szczegóły zapisanej trasy (pełna lista punktów JSON i parametry wejściowe).
    - Użytkownik może usunąć zapisaną trasę ze swojego konta.

### 3.6. Alternatywne propozycje tras

    - Po wygenerowaniu trasy, użytkownik ma opcję zażądania nowej propozycji przy użyciu tych samych parametrów wejściowych.

### 3.7. Obsługa błędów i informacji

    - Jeśli LLM nie jest w stanie wygenerować trasy dla podanych parametrów, użytkownik otrzymuje stosowny komunikat z sugestią zmiany parametrów lub ponownej próby.
    - W interfejsie użytkownika znajdują się informacje o eksperymentalnym charakterze funkcji generowania tras w MVP.

### 3.8. Prywatność i RODO

    - Aplikacja musi być zgodna z obowiązującymi przepisami o ochronie danych osobowych (RODO).
    - Należy jasno poinformować użytkownika o zakresie przetwarzanych danych (preferencje, dane motocykla, zapisane trasy) i celu ich przetwarzania.

## 4. Granice produktu (Co NIE wchodzi w zakres MVP)

- Udostępnianie wygenerowanych tras innym użytkownikom.
- Generowanie szczegółowego opisu trasy zawierającego zdjęcia czy opisy interesujących punktów na trasie (poza punktami
  tekstowymi generowanymi przez LLM).
- Funkcja śledzenia na żywo podczas pokonywania trasy.
- Zaawansowane planowanie uwzględniające dokładny czas przejazdu, punkty odpoczynku, stacje paliw czy rekomendacje
  noclegów.
- Analiza charakterystyki zakrętów (np. kąt, poziom trudności).
- Możliwość dodawania komentarzy do tras (tylko oceny gwiazdkowe).
- Wizualizacja trasy na interaktywnej mapie w aplikacji.
- Modyfikacja geometrii wygenerowanej trasy przez użytkownika.
- Wykorzystanie dedykowanych API mapowych lub routingowych do generowania, lub walidacji tras.
- Automatyczna walidacja poprawności geograficznej czy przejezdności trasy wygenerowanej przez LLM.
- Możliwość łączenia wielu priorytetów trasy (np. jednocześnie widokowa i kręta) przy generowaniu.
- Generowanie tras poza terytorium Polski.
- Możliwość podawania dodatkowych, szczegółowych preferencji trasy (poza głównym priorytetem i typem motocykla).

## 5. Historyjki użytkowników

### 5.1. Zarządzanie kontem

- ID: US-001
- Tytuł: Rejestracja nowego użytkownika
- Opis: Jako nowy użytkownik, chcę móc założyć konto w aplikacji używając mojego adresu email i hasła, abym mógł
  zapisywać preferencje i trasy.
- Kryteria akceptacji:
    - Mogę przejść do formularza rejestracji.
    - Mogę wprowadzić adres email i hasło (z potwierdzeniem hasła).
    - System waliduje poprawność formatu emaila.
    - System wymaga bezpiecznego hasła (np. minimalna długość).
    - Po pomyślnej rejestracji jestem zalogowany i przekierowany do aplikacji.
    - W przypadku błędu (np. email zajęty) widzę stosowny komunikat.

- ID: US-002
- Tytuł: Logowanie do aplikacji
- Opis: Jako zarejestrowany użytkownik, chcę móc zalogować się do aplikacji używając mojego emaila i hasła, abym uzyskał
  dostęp do moich preferencji i zapisanych tras.
- Kryteria akceptacji:
    - Mogę przejść do formularza logowania.
    - Mogę wprowadzić adres email i hasło.
    - Po pomyślnym logowaniu mam dostęp do funkcji wymagających autoryzacji (profil, generowanie, zapisane trasy).
    - W przypadku błędnych danych logowania widzę stosowny komunikat.
    - Nie mogę uzyskać dostępu do funkcji chronionych bez logowania.

### 5.2. Konfiguracja preferencji

- ID: US-003
- Tytuł: Konfiguracja profilu użytkownika
- Opis: Jako zalogowany użytkownik, chcę móc zdefiniować w moim profilu preferowany styl jazdy (jeden priorytet:
  widokowy, kręty, unikanie autostrad) oraz dane mojego motocykla (typ, pojemność, moc, rocznik), aby aplikacja mogła
  generować trasy dopasowane do moich potrzeb.
- Kryteria akceptacji:
    - Mogę przejść do sekcji edycji profilu.
    - Mogę wybrać jeden główny priorytet trasy z dostępnej listy.
    - Mogę wprowadzić dane tekstowe/liczbowe dotyczące motocykla w odpowiednich polach.
    - Mogę zapisać wprowadzone zmiany w profilu.
    - Zapisane preferencje i dane motocykla są widoczne przy kolejnym wejściu do profilu.
    - Zapisane preferencje są wykorzystywane domyślnie podczas generowania nowej trasy.

### 5.3. Generowanie i przeglądanie trasy

- ID: US-004
- Tytuł: Generowanie trasy motocyklowej
- Opis: Jako zalogowany użytkownik, chcę móc wygenerować propozycję trasy motocyklowej podając punkt startowy,
  wybierając priorytet trasy (domyślnie z profilu, z możliwością zmiany) oraz określając dystans lub czas, aby otrzymać
  spersonalizowaną listę punktów trasy do wykorzystania.
- Kryteria akceptacji:
    - Mogę wprowadzić tekstowy punkt startowy (np. "Warszawa, Pałac Kultury" lub "Zakopane").
    - Mogę wybrać priorytet trasy (widokowa, kręta, unikanie autostrad).
    - Mogę wprowadzić żądany dystans (np. w km) lub czas trwania (np. w godzinach).
    - Mogę zainicjować proces generowania trasy.
    - Podczas generowania widzę informację o trwającym procesie.
    - Po zakończeniu generowania widzę wynik (trasę lub komunikat o błędzie).
    - Zapytanie do LLM uwzględnia wszystkie podane parametry oraz dane z profilu (typ motocykla).
    - Proces generowania działa tylko dla obszaru Polski.

- ID: US-005
- Tytuł: Przeglądanie wygenerowanej trasy
- Opis: Jako użytkownik, po wygenerowaniu trasy chcę zobaczyć jej tytuł, podsumowanie oraz listę punktów w czytelnym
  formacie tekstowym (JSON), abym mógł zapoznać się z propozycją.
- Kryteria akceptacji:
    - Wygenerowana trasa jest wyświetlana na ekranie.
    - Widoczny jest tytuł i podsumowanie trasy (wygenerowane przez LLM).
    - Widoczna jest lista punktów trasy w formacie JSON (z polami `text` i opcjonalnymi współrzędnymi).
    - Lista punktów jest przedstawiona w sposób umożliwiający jej odczytanie.

- ID: US-006
- Tytuł: Kopiowanie punktów trasy
- Opis: Jako użytkownik, chcę móc łatwo skopiować wygenerowaną listę punktów trasy (JSON) do schowka, abym mógł ją
  wkleić do innej aplikacji (np. mapowej lub notatnika).
- Kryteria akceptacji:
    - Przy wyświetlonej trasie znajduje się przycisk/opcja "Kopiuj trasę".
    - Kliknięcie przycisku kopiuje całą strukturę JSON listy punktów do schowka systemowego.
    - Otrzymuję wizualne potwierdzenie skopiowania danych.

- ID: US-011
- Tytuł: Generowanie alternatywnej propozycji trasy
- Opis: Jako użytkownik, jeśli wygenerowana trasa mi nie odpowiada, chcę mieć możliwość poproszenia o nową propozycję
  dla tych samych parametrów wejściowych, aby sprawdzić inne możliwości.
- Kryteria akceptacji:
    - Przy wyświetlonej trasie znajduje się przycisk/opcja "Generuj inną propozycję".
    - Kliknięcie przycisku inicjuje ponowne zapytanie do LLM z tymi samymi parametrami wejściowymi (start, priorytet,
      dystans/czas, profil).
    - Wyświetlona zostaje nowa propozycja trasy lub komunikat o błędzie.

### 5.4. Zarządzanie zapisanymi trasami

- ID: US-007
- Tytuł: Zapisywanie wygenerowanej trasy
- Opis: Jako zalogowany użytkownik, chcę móc zapisać interesującą mnie, wygenerowaną trasę na moim koncie, abym mógł do
  niej wrócić później.
- Kryteria akceptacji:
    - Przy wyświetlonej trasie znajduje się przycisk/opcja "Zapisz trasę".
    - Kliknięcie przycisku zapisuje aktualnie wyświetlaną trasę (JSON, tytuł, podsumowanie) wraz z parametrami użytymi
      do jej wygenerowania (punkt startowy, priorytet, dystans/czas).
    - Otrzymuję wizualne potwierdzenie zapisania trasy.
    - Zapisana trasa pojawia się na liście moich zapisanych tras.

- ID: US-008
- Tytuł: Przeglądanie listy zapisanych tras
- Opis: Jako zalogowany użytkownik, chcę móc przejrzeć listę wszystkich tras, które zapisałem na swoim koncie, widząc
  ich tytuły i podsumowania, abym mógł łatwo zidentyfikować interesującą mnie trasę.
- Kryteria akceptacji:
    - Mogę przejść do sekcji "Moje zapisane trasy".
    - Widzę listę zapisanych tras, każda z widocznym tytułem i podsumowaniem.
    - Lista jest posortowana (np. od najnowszej do najstarszej).
    - Mogę kliknąć wybraną trasę, aby zobaczyć jej szczegóły.

- ID: US-014
- Tytuł: Obsługa pustej listy zapisanych tras
- Opis: Jako zalogowany użytkownik, który nie zapisał jeszcze żadnej trasy, po wejściu do sekcji "Moje zapisane trasy"
  chcę zobaczyć informację o braku tras zamiast pustego ekranu.
- Kryteria akceptacji:
    - Gdy lista zapisanych tras jest pusta, wyświetlany jest komunikat informujący o tym fakcie (np. "Nie masz jeszcze
      żadnych zapisanych tras. Wygeneruj i zapisz swoją pierwszą trasę!").

- ID: US-009
- Tytuł: Przeglądanie szczegółów zapisanej trasy
- Opis: Jako zalogowany użytkownik, chcę móc wyświetlić pełne szczegóły wybranej zapisanej trasy, w tym całą listę
  punktów JSON oraz parametry, które zostały użyte do jej wygenerowania.
- Kryteria akceptacji:
    - Po kliknięciu trasę na liście zapisanych tras przechodzę do widoku szczegółów.
    - Widoczny jest tytuł i podsumowanie trasy.
    - Widoczna jest pełna lista punktów trasy w formacie JSON.
    - Widoczne są parametry wejściowe użyte do wygenerowania tej trasy (punkt startowy, priorytet, dystans/czas).
    - Mogę skopiować listę punktów JSON (jak w US-006).

- ID: US-010
- Tytuł: Usuwanie zapisanej trasy
- Opis: Jako zalogowany użytkownik, chcę móc usunąć trasę z listy moich zapisanych tras, jeśli już jej nie potrzebuję.
- Kryteria akceptacji:
    - Na liście zapisanych tras lub w widoku szczegółów trasy znajduje się opcja "Usuń trasę".
    - Po wybraniu opcji usuwania widzę prośbę o potwierdzenie (aby uniknąć przypadkowego usunięcia).
    - Po potwierdzeniu trasa zostaje trwale usunięta z mojego konta.
    - Trasa znika z listy zapisanych tras.

### 5.5. Ocena i obsługa błędów

- ID: US-013
- Tytuł: Obsługa błędu generowania trasy przez LLM
- Opis: Jako użytkownik, w sytuacji, gdy system (LLM) nie jest w stanie wygenerować trasy dla podanych przeze mnie
  parametrów, chcę otrzymać jasny komunikat o błędzie oraz sugestię co mogę zrobić dalej.
- Kryteria akceptacji:
    - Jeśli generowanie trasy nie powiedzie się, zamiast trasy wyświetlany jest komunikat o błędzie.
    - Komunikat informuje o problemie z generowaniem trasy.
    - Komunikat sugeruje użytkownikowi zmianę parametrów (np. punktu startowego, dystansu, priorytetu) lub ponowną próbę
      generowania.

### 5.6. Wpływ danych z profilu

- ID: US-015
- Tytuł: Wpływ danych motocykla na sugestie trasy
- Opis: Jako użytkownik, oczekuję, że dane mojego motocykla wprowadzone w profilu (szczególnie pojemność) będą miały
  wpływ na generowane propozycje tras.
- Kryteria akceptacji:
    - Przy generowaniu trasy, zapytanie do LLM zawiera informację o typie/pojemności motocykla użytkownika.
    - (Testowalność zależna od implementacji LLM i promptu) Dla motocykla o małej pojemności, sugerowane trasy (przy
      podobnych parametrach czasu/priorytetu) są potencjalnie krótsze lub mniej wymagające niż dla motocykla o dużej
      pojemności. Należy zdefiniować sposób testowania tego zachowania.

## 6. Metryki sukcesu

Sukces wersji MVP będzie mierzony za pomocą następujących wskaźników:

- 6.1. Adopcja konfiguracji profilu: Minimum 80% zarejestrowanych użytkowników uzupełniło swoje preferencje (
  przynajmniej jeden priorytet stylu jazdy) w profilu w ciągu pierwszego miesiąca od rejestracji.
    - Mierzone przez: Analiza danych w bazie użytkowników.

- 6.2. Aktywność użytkowników: Minimum X% użytkowników (którzy zalogowali się co najmniej raz po rejestracji)
  wygenerowało co najmniej 2-3 trasy w pierwszym miesiącu używania aplikacji.
    - Mierzone przez: Logi systemowe dotyczące generowania tras, powiązane z ID użytkowników.
    - Uwaga: Konkretna wartość procentowa (X%) dla tego kryterium musi zostać ustalona.

- 6.3. Satysfakcja z generowanych tras: Średnia ocena gwiazdkowa dla wszystkich ocenionych, wygenerowanych tras
  przekracza Y gwiazdek (np. Y = 3.5) w ciągu pierwszych 3 miesięcy od uruchomienia MVP.
    - Mierzone przez: Agregacja ocen gwiazdkowych przypisanych do tras.
    - Uwaga: Konkretna wartość progowa (Y) dla średniej oceny musi zostać ustalona.
    - Dodatkowo: Zbieranie ogólnych opinii użytkowników (np. poprzez opcjonalną krótką ankietę w aplikacji lub email) w
      celu jakościowej oceny trafności tras.