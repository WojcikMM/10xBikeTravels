<conversation_summary>

1. **Priorytety tras (Widoki):** Akceptowane typy widoków to: góry, jeziora, wybrzeże, obszary leśne, łąki, kaniony.
2. **Priorytety tras (Wybór):** W MVP użytkownik wybiera tylko jeden główny priorytet trasy (np. widokowa, kręta).
   Możliwość łączenia priorytetów jest rozważana po MVP.
3. **Preferencje w profilu:** Oprócz preferencji stylu jazdy (kręte, widokowe, unikanie autostrad), profil będzie
   zawierał informacje o motocyklu: typ, pojemność, moc, rocznik. Wpływ tych danych na trasę będzie polegał np. na
   sugerowaniu krótszych tras dla mniejszych pojemności.
4. **Definiowanie punktu startowego:** Użytkownik wpisuje adres/lokalizację w polu tekstowym.
5. **Prezentacja tras:** W MVP trasy będą prezentowane jako **lista punktów tekstowych** w formacie JSON (każdy punkt z
   polem `text` i opcjonalnie współrzędnymi). **Nie będzie komponentu mapy w MVP**. Format ten ma umożliwiać łatwe
   skopiowanie do zewnętrznych aplikacji mapowych.
6. **Liczba generowanych tras:** Domyślnie generowana jest jedna trasa. Użytkownik będzie miał opcję wygenerowania nowej
   propozycji dla tych samych parametrów wejściowych.
7. **Ocena tras:** Użytkownicy będą mogli oceniać trasy za pomocą systemu "gwiazdkowego". Komentarze są poza zakresem
   MVP.
8. **Mechanizm generowania tras:** Trasy będą generowane **wyłącznie za pomocą modelu LLM (AI)**, bazując na danych
   tekstowych dostępnych w internecie. **Nie będą używane dedykowane API mapowe ani routingowe** w MVP. Podejście to
   jest traktowane jako eksperymentalne (Proof of Concept).
9. **Obsługa błędów generowania:** Jeśli LLM nie wygeneruje satysfakcjonującej trasy lub nie będzie mógł jej
   wygenerować, użytkownik zostanie o tym poinformowany komunikatem i zachęcony do zmiany parametrów lub ponownej próby.
   Nie będzie dodatkowej walidacji odpowiedzi LLM w MVP.
10. **Koszty:** W MVP wykorzystane zostaną darmowe plany LLM.
11. **Zasięg geograficzny:** MVP będzie ograniczone do **Polski**.
12. **Zarządzanie zapisanymi trasami:** Wygenerowane trasy (listy punktów) będą zapisywane na koncie użytkownika. Przy
    generowaniu trasy LLM powinien również wygenerować krótki **tytuł i podsumowanie** trasy, aby ułatwić ich
    identyfikację na liście. Użytkownik po kliknięciu na zapisaną trasę zobaczy jej punkty.
13. **Kryterium sukcesu (Aktywność):** Zmieniono na: "sukcesem będzie wygenerowanie przez użytkownika (który zalogował
    się przynajmniej raz po rejestracji) co najmniej 2-3 tras w pierwszym miesiącu używania aplikacji".
14. **Dodatkowe preferencje trasy:** Poza głównym priorytetem i typem motocykla, użytkownik nie będzie mógł podawać
    innych preferencji w MVP.

<matched_recommendations>

1. **Precyzyjne zdefiniowanie formatu wyjściowego trasy z LLM:** Należy w PRD dokładnie określić strukturę JSON (pole
   `text`, opcjonalne współrzędne) oraz zawartość generowanego tytułu i podsumowania trasy. (Odnosi się do decyzji 5 i
    12)
2. **Opisanie strategii prompt engineeringu:** W PRD warto zawrzeć założenia dotyczące konstrukcji zapytań do LLM,
   uwzględniając preferencje użytkownika (styl jazdy, typ motocykla), punkt startowy, dystans/czas i ograniczenie do
   Polski. (Odnosi się do decyzji 1, 3, 4, 8, 11 i pytania o prompt)
3. **Zaprojektowanie interfejsu dla tras tekstowych:** PRD powinno zawierać opis lub makiety interfejsu do przeglądania
   listy zapisanych tras (z tytułami/podsumowaniami), wyświetlania szczegółów (listy punktów) i usuwania tras. Należy
   uwzględnić zapisywanie parametrów wejściowych wraz z trasą. (Odnosi się do decyzji 5 i 12)
4. **Zaznaczenie eksperymentalnego charakteru MVP:** W PRD należy jasno komunikować, że poleganie wyłącznie na LLM jest
   eksperymentem i niesie ryzyko niedokładności tras. Opisać sposób informowania o tym użytkowników. (Odnosi się do
   decyzji 8 i 9)
5. **Doprecyzowanie kryteriów sukcesu:** Upewnić się, że wszystkie kryteria sukcesu (w tym dotyczące profilu i ocen
   gwiazdkowych) są precyzyjnie zdefiniowane i mierzalne w PRD. (Odnosi się do decyzji 7, 13 oraz pierwotnych kryteriów)
6. **Uwzględnienie obsługi błędów:** PRD powinno opisywać sposób informowania użytkownika o niemożności wygenerowania
   trasy lub potencjalnych problemach z jakością (zgodnie z decyzją). (Odnosi się do decyzji 9)
7. **Zdefiniowanie przepływów użytkownika (User Flows):** Rekomenduje się dołączenie do PRD przepływów dla kluczowych
   scenariuszy (rejestracja, konfiguracja profilu, generowanie trasy, przeglądanie/zapisywanie/usuwanie trasy
   tekstowej).
8. **Uwzględnienie kwestii prywatności:** PRD powinno zawierać zapisy dotyczące RODO i prywatności danych użytkownika (
   preferencje, zapisane trasy). </matched_recommendations>

<prd_planning_summary>

- **Główne wymagania funkcjonalne:**
    - System rejestracji i logowania użytkowników.
    - Profil użytkownika z możliwością zdefiniowania preferencji stylu jazdy (widokowa, kręta, unikanie autostrad -
      wybór jednego priorytetu w MVP) oraz danych motocykla (typ, pojemność, moc, rocznik).
    - Generator tras oparty wyłącznie na LLM, przyjmujący jako wejście: punkt startowy (tekstowy), preferencje z
      profilu, wybrany priorytet, planowany dystans/czas. Generator działa tylko dla Polski.
    - Prezentacja wygenerowanej trasy jako listy punktów w formacie JSON (z polem `text` i opcjonalnymi koordynatami),
      bez wizualizacji na mapie.
    - Możliwość zażądania nowej propozycji trasy dla tych samych parametrów.
    - Możliwość zapisywania wygenerowanych tras (list punktów wraz z tytułem i podsumowaniem generowanym przez LLM oraz
      parametrami wejściowymi) na koncie użytkownika.
    - Możliwość przeglądania listy zapisanych tras i ich usuwania.
    - System ocen "gwiazdkowych" dla wygenerowanych tras.
    - Obsługa sytuacji, gdy LLM nie może wygenerować trasy (komunikat dla użytkownika).

- **Kluczowe historie użytkownika i ścieżki korzystania:**
    1. _Rejestracja/Logowanie:_ Użytkownik tworzy konto lub loguje się.
    2. _Konfiguracja profilu:_ Użytkownik wchodzi do profilu i ustawia swoje preferencje dotyczące stylu jazdy oraz dane
       motocykla.
    3. _Generowanie trasy:_ Użytkownik podaje punkt startowy (tekst), wybiera priorytet trasy, określa dystans/czas i
       inicjuje generowanie. Aplikacja wysyła zapytanie do LLM.
    4. _Przeglądanie trasy:_ Użytkownik widzi wygenerowaną listę punktów, tytuł i podsumowanie. Ma możliwość skopiowania
       listy punktów.
    5. _Zapisywanie trasy:_ Użytkownik decyduje się zapisać wygenerowaną trasę na swoim koncie.
    6. _Generowanie alternatywy:_ Użytkownik klika opcję, aby uzyskać inną propozycję trasy dla tych samych parametrów.
    7. _Ocena trasy:_ Użytkownik ocenia wygenerowaną trasę za pomocą gwiazdek.
    8. _Zarządzanie trasami:_ Użytkownik przegląda listę swoich zapisanych tras (widząc tytuły/podsumowania), wchodzi w
       szczegóły (widzi listę punktów) i może usunąć wybrane trasy.

- **Ważne kryteria sukcesu i sposoby ich mierzenia:**
    1. _Uzupełnienie profilu:_ Minimum 80% zarejestrowanych użytkowników uzupełniło swoje preferencje w profilu w ciągu
       pierwszego miesiąca od rejestracji (Mierzone poprzez analizę danych w bazie).
    2. _Aktywność użytkowników:_ Minimum X% użytkowników (którzy zalogowali się co najmniej raz po rejestracji)
       wygenerowało co najmniej 2-3 trasy w pierwszym miesiącu używania aplikacji (Mierzone poprzez logi generowania
       tras powiązane z użytkownikami. Należy ustalić konkretną wartość X%).
    3. _Satysfakcja z tras:_ Pozytywne opinie użytkowników mierzone za pomocą średniej ocen gwiazdkowych dla
       generowanych tras (np. średnia ocena powyżej Y gwiazdek).

- **Podejście techniczne MVP:** Wykorzystanie LLM jako głównego silnika generowania tras (bez API map/routingu),
  prezentacja tras w formie tekstowej (JSON). Aplikacja webowa (PWA) z backendem (Next.js lub ASP.NET Core + React).
  Ograniczenie geograficzne do Polski. Wykorzystanie darmowych planów LLM. </prd_planning_summary>

<unresolved_issues>

1. **Szczegółowa strategia Prompt Engineeringu:** Wymaga opracowania konkretnych przykładów promptów, które będą
   wysyłane do LLM, uwzględniając wszystkie zebrane preferencje i parametry, aby zmaksymalizować szansę na uzyskanie
   użytecznych tras tekstowych.
2. **Dokładna definicja formatu JSON dla trasy:** Należy sfinalizować dokładną strukturę JSON zwracanego przez LLM (jak
   mają wyglądać koordynaty, czy dodawać inne pola np. szacowany odcinek drogi).
3. **Konkretna wartość X% dla kryterium aktywności:** Należy ustalić docelowy procent aktywnych użytkowników
   generujących trasy.
4. **Szczegółowy harmonogram prac:** Brak harmonogramu na 6 tygodni, co jest ryzykowne przy ambitnym celu.

</unresolved_issues>
</conversation_summary>
