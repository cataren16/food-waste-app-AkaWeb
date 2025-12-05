# food-waste-app-AkaWeb
Interactive and community-based food waste app group project developed using React.js, Node.js, Express and Tailwind CSS.

# Echipa - AkaWeb 
- Răsmeriță Andra, Renghiuț Cătălina, Roșoiu Anca

# Tema alocată - Food Waste App

# Obiectiv 
- Realizarea unei aplicații web cu scopul de a încuraja utilizatorii să conștientizeze risipa de alimente într-un mod distractiv și bazat pe comunitate

# Structură & funcționalități aplicație 

Pagina de register
- formular cu câmpuri pentru înregistrarea unui nou user (ex. Nume, email, parolă)
- utilizarea validărilor și a popup-urilor de eroare la introducerea unor date incorecte

Pagina de login
- formular cu email și parolă pentru autentificarea unui user deja existent
- redirecționarea user-ului către Homepage 

Pagina de resetare parolă
- formular cu introducere de email în baza căruia user-ul primește mail de resetare a parolei

Homepage 
- feed principal cu produsele listate de către userii din lista de prieteni sau de către useri din grupuri comune
- fiecare card cu produsul contine detalii despre produs (nume distribuitor, nume produs, data expirării, preț) + buton de claim pentru rezervarea produsului respectiv (proprietarul va primi o notificare care poate fi acceptată/nu)
- searchbar pentru cautarea unor potențiali prieteni
- secțiune cu cereri de prietenie (trimise/primite) care sunt în așteptare
- secțiune cu lista de prieteni
- secțiune cu grupuri de prieteni din care user-ul logat face parte
- opțiune de creare a unui grup nou

Pagina de profil
- descriere profil + setare status (vegetarian, carnivor, etc)
- lista produselor adăugate de utilizator din frigiderul propriu, pe categorii
- buton de adaugare a unui produs nou (redirecționare către un formular)
- fiecare produs are o descriere, opțiuni de ștergere/editare, opțiune de setare a disponibilității
- secțiune de notificări, alerte (cereri de produse aprobate, solicitări de produse, expirare de produse)

Pagina de grup
- lista membrilor din grup și a produselor listate de către aceștia
- nume grup și opțiuni de editare a numelui/descrierii și gestionare a membrilor de către admin
- buton de adăugare a unui nou membru din lista de prieteni
- buton de părăsire a grupului

Pagina cu istoricul tranzacțiilor (sell-out)
- secțiune cu cererile mele
- secțiune cu cererile primite
- butoane de aprobare/respingere cereri
- secțiune cu istoric complet (arhivă a tuturor tranzacțiilor finalizate)

# Tehnologii folosite 
Frontend - React.js + Tailwind CSS
Backend - Node.js + Express + Sequelize (ORM) + SQLite

# Modalitate de lucru 
- distribuire task-uri în mod egal
- lucrat exclusiv pe branch-uri separate denumite sugestiv și concis
- lucrat individual și team check-uri periodice de progres
- commit-uri progresive și pull-requests

# Plan de lucru orientativ

Săptămâna 1 - Fundație proiect, schemă bază de date, setup proiect, creare fișiere pentru componente principale

Săptămâna 2 - Funcționalități de login și register

Săptămâna 3 - CRUD pentru produsele user-ului

Săptămâna 4 - Notificări, funcționalități de interacțiune cu prietenii

Săptămâna 5 - Sistem de disponibilitate al produselor (feed de produse, setarea disponibilității unui produs)

Săptămâna 6 - Sistem de claim pe produse și pagina de “istoric tranzacții”

Săptămâna 7 - Funcționalitate grupuri de prieteni

Săptămâna 8 - Polishing și testare


# Serviciu RESTful

IMPORTANT: Testarea backend-ului necesita instalarea Docker pentru desktop. Pentru vizualizarea bazei de date locale se poate opta pentru o extensie VSCode (SQLite Viewer)

Rulati intr-un terminal de tip Git Bash urmatoarele comenzi in ordine:
- pornire backend (port:3000) + frontend (port:5173): docker compose up --build
- populare baza de date locala SQLite: docker compose exec backend node seed.js
- inchidere backend + frontend : docker compose down

Rutele se gasesc sub prefixul: http://localhost:3000/api/










