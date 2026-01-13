const db = require("./models");
const sequelize = db.sequelize;

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function pair(a, b) {
  const A = Number(a);
  const B = Number(b);
  return A < B ? [A, B] : [B, A];
}

async function main() {
  try {
    console.log("⏳ Reset DB (sync force)...");
    await sequelize.sync({ force: true });

    const users = await db.User.bulkCreate(
      [
        { nume: "Popescu", prenume: "Ana", email: "ana@test.com", parola: "1234", descriere: "Îmi place să gătesc și să donez surplus." },
        { nume: "Ionescu", prenume: "Maria", email: "maria@test.com", parola: "1234", descriere: "Fan legume bio și rețete rapide." },
        { nume: "Georgescu", prenume: "Andrei", email: "andrei@test.com", parola: "1234", descriere: "Meal prep în cantități industriale 😄" },

        { nume: "Popa", prenume: "Bianca", email: "bianca@test.com", parola: "1234", descriere: "Mâncare sănătoasă, zero risipă." },
        { nume: "Dumitrescu", prenume: "Vlad", email: "vlad@test.com", parola: "1234", descriere: "Producător local, donez legume." },
        { nume: "Stan", prenume: "Radu", email: "radu@test.com", parola: "1234", descriere: "Keto/low-carb și sport." },
        { nume: "Matei", prenume: "Ioana", email: "ioana@test.com", parola: "1234", descriere: "Fără gluten, fără stres." },
        { nume: "Marin", prenume: "Sofia", email: "sofia@test.com", parola: "1234", descriere: "Vegan, încerc rețete noi." },
      ],
      { returning: true }
    );

    const [Ana, Maria, Andrei, Bianca, Vlad, Radu, Ioana, Sofia] = users;
    console.log("✔ Users created:", users.length);

    const friendPairs = [
      { u1: Ana, u2: Maria, s: 1 },
      { u1: Ana, u2: Andrei, s: 1 },
      { u1: Maria, u2: Andrei, s: 1 },

      { u1: Ana, u2: Bianca, s: 1 },
      { u1: Ana, u2: Vlad, s: 1 },
      { u1: Ana, u2: Ioana, s: 1 },
      { u1: Ana, u2: Sofia, s: 0 }, // pending

      { u1: Maria, u2: Bianca, s: 1 },
      { u1: Maria, u2: Sofia, s: 1 },
      { u1: Maria, u2: Radu, s: 0 }, // pending

      { u1: Andrei, u2: Vlad, s: 1 },
      { u1: Andrei, u2: Radu, s: 1 },
      { u1: Andrei, u2: Ioana, s: 0 }, // pending

      { u1: Bianca, u2: Sofia, s: 1 },
      { u1: Vlad, u2: Ioana, s: 1 },
    ];

    const friendships = friendPairs.map(({ u1, u2, s }) => {
      const [id1, id2] = pair(u1.id_utilizator, u2.id_utilizator);
      return { id_utilizator_1: id1, id_utilizator_2: id2, status_prietenie: s };
    });

    await db.Prietenii.bulkCreate(friendships);
    console.log("✔ Friendships created:", friendships.length);

    const [VeggieLovers, ZeroWasteBucuresti, KetoCrew, GlutenFreeBuddies] = await Promise.all([
      db.Grup.create({
        id_admin: Maria.id_utilizator,
        nume_grup: "VeggieLovers",
        descriere: "Vegetarian friendly – schimb de ingrediente & rețete",
        status_dieta: "Vegetarian",
      }),
      db.Grup.create({
        id_admin: Vlad.id_utilizator,
        nume_grup: "ZeroWaste București",
        descriere: "Donații rapide în cartiere, fără risipă",
        status_dieta: "Omnivor",
      }),
      db.Grup.create({
        id_admin: Radu.id_utilizator,
        nume_grup: "KetoCrew",
        descriere: "Low-carb / keto – fără risipă",
        status_dieta: "Keto",
      }),
      db.Grup.create({
        id_admin: Ioana.id_utilizator,
        nume_grup: "GlutenFreeBuddies",
        descriere: "Comunitate fără gluten + recomandări",
        status_dieta: "Fără gluten",
      }),
    ]);

    const membri = [
      { g: VeggieLovers, u: Maria },
      { g: VeggieLovers, u: Ana },
      { g: VeggieLovers, u: Sofia },
      { g: VeggieLovers, u: Bianca },

      { g: ZeroWasteBucuresti, u: Vlad },
      { g: ZeroWasteBucuresti, u: Ana },
      { g: ZeroWasteBucuresti, u: Maria },
      { g: ZeroWasteBucuresti, u: Andrei },
      { g: ZeroWasteBucuresti, u: Bianca },

      { g: KetoCrew, u: Radu },
      { g: KetoCrew, u: Andrei },
      { g: KetoCrew, u: Vlad },
      { g: KetoCrew, u: Ana },

      { g: GlutenFreeBuddies, u: Ioana },
      { g: GlutenFreeBuddies, u: Ana },
      { g: GlutenFreeBuddies, u: Maria },
      { g: GlutenFreeBuddies, u: Sofia },
    ].map(({ g, u }) => ({
      id_grup: g.id_grup,
      id_utilizator: u.id_utilizator,
    }));

    await db.MembriGrup.bulkCreate(membri);
    console.log("✔ Groups created: 4, members rows:", membri.length);

    const productRows = [];

    function addProduct(u, name, cat, qty, expInDays, disponibil = true, id_grup = null, imagine = null) {
      productRows.push({
        id_utilizator: u.id_utilizator,
        denumire_produs: name,
        categorie: cat,
        cantitate: qty,
        data_expirare: daysFromNow(expInDays),
        disponibil,
        id_grup,
        imagine,
      });
    }

    addProduct(Ana, "Mere Golden", "Fructe", 8, 7);
    addProduct(Ana, "Banane", "Fructe", 6, 3);
    addProduct(Ana, "Morcovi", "Legume", 10, 10, true, ZeroWasteBucuresti.id_grup);
    addProduct(Ana, "Năut fiert", "Conserve", 3, 5, true, VeggieLovers.id_grup);
    addProduct(Ana, "Lapte de migdale", "Băuturi", 2, 12);
    addProduct(Ana, "Făină fără gluten", "Panificație", 1, 90, true, GlutenFreeBuddies.id_grup);
    addProduct(Ana, "Roșii pasate", "Conserve", 4, 40);
    addProduct(Ana, "Ciuperci", "Legume", 5, 5);
    addProduct(Ana, "Orez basmati", "Cereale", 2, 180);
    addProduct(Ana, "Iaurt fără lactoză", "Lactate", 2, 6);
    addProduct(Ana, "Pasta integrală", "Cereale", 2, 120);
    addProduct(Ana, "Ceapă", "Legume", 6, 25);

    addProduct(Maria, "Pâine integrală", "Panificație", 3, 2);
    addProduct(Maria, "Avocado", "Fructe", 4, 4, true, VeggieLovers.id_grup);
    addProduct(Maria, "Hummus", "Gustări", 2, 6, true, VeggieLovers.id_grup);
    addProduct(Maria, "Spanac baby", "Legume", 2, 5);
    addProduct(Maria, "Quinoa", "Cereale", 1, 240);
    addProduct(Maria, "Linte roșie", "Cereale", 2, 300);
    addProduct(Maria, "Brânză cottage", "Lactate", 2, 8);
    addProduct(Maria, "Roșii cherry", "Legume", 12, 7, true, ZeroWasteBucuresti.id_grup);
    addProduct(Maria, "Migdale crude", "Gustări", 1, 365);
    addProduct(Maria, "Ciocolată neagră", "Dulciuri", 3, 120);
    addProduct(Maria, "Ardei gras", "Legume", 5, 6);
    addProduct(Maria, "Mere verzi", "Fructe", 7, 9);

    addProduct(Andrei, "Castraveți Bio", "Legume", 8, 6);
    addProduct(Andrei, "Piept de pui", "Carne", 5, 3);
    addProduct(Andrei, "Ouă", "Ouă", 12, 14, true, KetoCrew.id_grup);
    addProduct(Andrei, "Brânză cheddar", "Lactate", 2, 20, true, KetoCrew.id_grup);
    addProduct(Andrei, "Somon afumat", "Pește", 2, 9);
    addProduct(Andrei, "Broccoli", "Legume", 3, 5);
    addProduct(Andrei, "Ulei de măsline", "Uleiuri", 1, 500);
    addProduct(Andrei, "Făină de migdale", "Panificație", 1, 180, true, KetoCrew.id_grup);
    addProduct(Andrei, "Iaurt grecesc", "Lactate", 3, 10);
    addProduct(Andrei, "Zucchini", "Legume", 4, 6);
    addProduct(Andrei, "Conopidă", "Legume", 2, 6);
    addProduct(Andrei, "Nuci", "Gustări", 2, 250);

    addProduct(Bianca, "Granola de casă", "Mic dejun", 2, 12);
    addProduct(Bianca, "Portocale", "Fructe", 7, 9, true, ZeroWasteBucuresti.id_grup);
    addProduct(Bianca, "Salată mix", "Legume", 2, 4);
    addProduct(Vlad, "Roșii de grădină", "Legume", 20, 5, true, ZeroWasteBucuresti.id_grup);
    addProduct(Vlad, "Ardei kapia", "Legume", 10, 7);
    addProduct(Vlad, "Cartofi", "Legume", 12, 30);
    addProduct(Radu, "Ton la conservă", "Conserve", 5, 500);
    addProduct(Radu, "Cașcaval", "Lactate", 2, 18, true, KetoCrew.id_grup);
    addProduct(Ioana, "Făină de orez", "Panificație", 2, 180, true, GlutenFreeBuddies.id_grup);
    addProduct(Ioana, "Paste fără gluten", "Panificație", 3, 220);
    addProduct(Sofia, "Lapte de cocos", "Băuturi", 2, 40, true, VeggieLovers.id_grup);
    addProduct(Sofia, "Tofu", "Proteine", 3, 10);

    const products = await db.Product.bulkCreate(productRows, { returning: true });
    console.log("✔ Products created:", products.length);

    function findProd(name, owner = null) {
      const found = products.find((p) => {
        if (p.denumire_produs !== name) return false;
        if (!owner) return true;
        return String(p.id_utilizator) === String(owner.id_utilizator);
      });
      if (!found) throw new Error(`Nu găsesc produsul: "${name}"`);
      return found;
    }

 
    const solicitariRows = [
      { id_produs: findProd("Pâine integrală", Maria).id_produs, id_solicitant: Ana.id_utilizator, status_solicitare: 0, nr_bucati: 1 },
      { id_produs: findProd("Castraveți Bio", Andrei).id_produs, id_solicitant: Maria.id_utilizator, status_solicitare: 0, nr_bucati: 2 },
      { id_produs: findProd("Granola de casă", Bianca).id_produs, id_solicitant: Sofia.id_utilizator, status_solicitare: 0, nr_bucati: 1 },

      { id_produs: findProd("Roșii de grădină", Vlad).id_produs, id_solicitant: Maria.id_utilizator, status_solicitare: 1, nr_bucati: 4 },
      { id_produs: findProd("Ouă", Andrei).id_produs, id_solicitant: Ana.id_utilizator, status_solicitare: 1, nr_bucati: 6 },
      { id_produs: findProd("Lapte de cocos", Sofia).id_produs, id_solicitant: Ana.id_utilizator, status_solicitare: 1, nr_bucati: 1 },
    ];

    const solicitari = await db.Solicitare.bulkCreate(solicitariRows, { returning: true });
    console.log("✔ Claims/Solicitari created:", solicitari.length);


    const tranzactiiRows = [
      {
        id_produs: findProd("Roșii de grădină", Vlad).id_produs,
        id_proprietar: Vlad.id_utilizator,
        id_beneficiar: Maria.id_utilizator,
        nr_bucati: 4,
        data_finalizare: new Date(),
      },
      {
        id_produs: findProd("Ouă", Andrei).id_produs,
        id_proprietar: Andrei.id_utilizator,
        id_beneficiar: Ana.id_utilizator,
        nr_bucati: 6,
        data_finalizare: new Date(),
      },
      {
        id_produs: findProd("Lapte de cocos", Sofia).id_produs,
        id_proprietar: Sofia.id_utilizator,
        id_beneficiar: Ana.id_utilizator,
        nr_bucati: 1,
        data_finalizare: new Date(),
      },
      {
        id_produs: findProd("Roșii cherry", Maria).id_produs,
        id_proprietar: Maria.id_utilizator,
        id_beneficiar: Bianca.id_utilizator,
        nr_bucati: 5,
        data_finalizare: new Date(),
      },
    ];

    const tranzactii = await db.Tranzactie.bulkCreate(tranzactiiRows, { returning: true });
    console.log("✔ Tranzactii created:", tranzactii.length);

    const notificariRows = [
      { id_utilizator: Maria.id_utilizator, mesaj: "Ai o solicitare nouă pentru Pâine integrală.", citita: false, data_notificare: new Date() },
      { id_utilizator: Andrei.id_utilizator, mesaj: "Maria a trimis o solicitare pentru Castraveți Bio.", citita: false, data_notificare: new Date() },
      { id_utilizator: Vlad.id_utilizator, mesaj: "Tranzacție finalizată: Roșii de grădină → Maria.", citita: true, data_notificare: new Date() },
      { id_utilizator: Ana.id_utilizator, mesaj: "Tranzacție finalizată: Ouă (Andrei) → Ana.", citita: true, data_notificare: new Date() },
      { id_utilizator: Sofia.id_utilizator, mesaj: "Ai fost adăugată în grupul VeggieLovers.", citita: false, data_notificare: new Date() },
      { id_utilizator: Ioana.id_utilizator, mesaj: "Ai o invitație de prietenie (pending) de la Andrei.", citita: false, data_notificare: new Date() },
    ];

    await db.Notificare.bulkCreate(notificariRows);
    console.log("✔ Notificari created:", notificariRows.length);

    console.log("🎉 Seed complet: aplicația arată populată și „vie”.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Eroare la seeding:", err);
    process.exit(1);
  }
}

main();
