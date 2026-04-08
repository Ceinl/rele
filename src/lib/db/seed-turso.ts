import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

// Usage: TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... bun run seed:turso
const DB_URL = process.env.TURSO_DATABASE_URL!;
const DB_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!DB_URL) {
  console.error("Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN env vars");
  process.exit(1);
}

async function seed() {
  const client = createClient({
    url: DB_URL,
    authToken: DB_TOKEN || undefined,
  });

  console.log("Creating tables...");
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL
    )
  `);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_by INTEGER NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL
    )
  `);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL REFERENCES categories(id),
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      long_answer TEXT,
      created_by INTEGER NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL
    )
  `);

  console.log("Seeding data...");
  const adminPassword = await bcrypt.hash("676767", 10);
  const userPassword = await bcrypt.hash("42489", 10);
  const now = new Date().toISOString();

  const adminResult = await client.execute({
    sql: "INSERT INTO users (username, password, name, role, created_at) VALUES (?, ?, ?, ?, ?)",
    args: ["admin", adminPassword, "Admin", "admin", now],
  });
  const adminId = Number(adminResult.lastInsertRowid);

  await client.execute({
    sql: "INSERT INTO users (username, password, name, role, created_at) VALUES (?, ?, ?, ?, ?)",
    args: ["slyva", userPassword, "Slyva", "user", now],
  });

  const bioResult = await client.execute({
    sql: "INSERT INTO categories (name, description, created_by, created_at) VALUES (?, ?, ?, ?)",
    args: ["Biology Basics", "Cell biology, genetics, and evolution fundamentals", adminId, now],
  });
  const biologyId = Number(bioResult.lastInsertRowid);

  const histResult = await client.execute({
    sql: "INSERT INTO categories (name, description, created_by, created_at) VALUES (?, ?, ?, ?)",
    args: ["World History", "Major events and civilizations from antiquity to modernity", adminId, now],
  });
  const historyId = Number(histResult.lastInsertRowid);

  const mathResult = await client.execute({
    sql: "INSERT INTO categories (name, description, created_by, created_at) VALUES (?, ?, ?, ?)",
    args: ["Calculus", "Derivatives, integrals, and limits", adminId, now],
  });
  const mathId = Number(mathResult.lastInsertRowid);

  type Q = { q: string; a: string; la: string | null; catId: number };
  const questions: Q[] = [
    { q: "What is the powerhouse of the cell?", a: "Mitochondria", la: "Mitochondria are membrane-bound organelles that produce ATP through cellular respiration, serving as the primary energy source for eukaryotic cells.", catId: biologyId },
    { q: "What is DNA replication?", a: "Copying DNA before cell division", la: "The process by which a double-stranded DNA molecule is copied to produce two identical DNA molecules, occurring during the S phase of cell division. It involves unwinding the double helix, synthesizing complementary strands using DNA polymerase, and proofreading for errors.", catId: biologyId },
    { q: "What are the four bases in DNA?", a: "A, T, G, C", la: "Adenine (A) pairs with Thymine (T), and Guanine (G) pairs with Cytosine (C). These base pairs are held together by hydrogen bonds.", catId: biologyId },
    { q: "What is natural selection?", a: "Survival of the fittest traits", la: "The process by which organisms with favorable traits are more likely to survive and reproduce, passing those traits to the next generation. Over time, this leads to adaptation and speciation.", catId: biologyId },
    { q: "Mitosis vs meiosis?", a: "Mitosis = 2 identical cells, meiosis = 4 unique cells", la: "Mitosis produces two identical diploid cells for growth and repair, involving one division. Meiosis produces four unique haploid cells (gametes) for reproduction, involving two divisions and crossing over.", catId: biologyId },
    { q: "What is osmosis?", a: "Water moving across a membrane", la: "The movement of water molecules across a semipermeable membrane from an area of lower solute concentration to higher concentration. A passive process crucial for maintaining cell turgor and fluid balance.", catId: biologyId },
    { q: "When did the Roman Empire fall?", a: "476 CE", la: "The Western Roman Empire fell in 476 CE when the last emperor, Romulus Augustulus, was deposed by the Germanic chieftain Odoacer. This marked the end of ancient Rome and the beginning of the medieval period.", catId: historyId },
    { q: "What caused World War I?", a: "Alliances, militarism, imperialism, assassination", la: "A complex web of alliances, militarism, imperialism, and nationalism triggered by the assassination of Archduke Franz Ferdinand in Sarajevo on June 28, 1914.", catId: historyId },
    { q: "What was the Renaissance?", a: "Revival of classical art and learning, 14th-17th century", la: "A cultural and intellectual movement spanning the 14th-17th centuries, originating in Italian city-states. Marked by a revival of classical Greek and Roman art, literature, and learning.", catId: historyId },
    { q: "What was the Cold War?", a: "US vs USSR tension, 1947-1991", la: "A period of geopolitical tension between the United States and the Soviet Union from 1947-1991, characterized by proxy wars, nuclear arms race, space race, and ideological competition.", catId: historyId },
    { q: "Who built the Great Wall of China?", a: "Multiple dynasties, starting with Qin Shi Huang", la: "Multiple Chinese dynasties contributed, beginning with Qin Shi Huang around 221 BCE. The most well-known sections were built by the Ming Dynasty (1368-1644 CE).", catId: historyId },
    { q: "Derivative of x squared?", a: "2x", la: "Using the power rule: d/dx(x^n) = nx^(n-1), so d/dx(x^2) = 2x. The slope of the curve y = x^2 at any point x is equal to 2x.", catId: mathId },
    { q: "Fundamental Theorem of Calculus?", a: "Differentiation and integration are inverses", la: "It states that differentiation and integration are inverse operations. Part 1: the derivative of the integral of f(x) is f(x). Part 2: the integral from a to b of f(x)dx equals F(b) minus F(a).", catId: mathId },
    { q: "What is the chain rule?", a: "d/dx[f(g(x))] = f'(g(x)) times g'(x)", la: "The chain rule is used for differentiating composite functions. If y = f(g(x)), then dy/dx = f'(g(x)) * g'(x). It unwraps nested functions layer by layer.", catId: mathId },
    { q: "What is a limit?", a: "Value a function approaches as input approaches a point", la: "The value that a function approaches as the input approaches some value. Written as lim(x->a) f(x) = L. Limits are the foundation of calculus.", catId: mathId },
    { q: "What is L'Hopital's Rule?", a: "For 0/0 or infinity/infinity: lim f(x)/g(x) = lim f'(x)/g'(x)", la: "For indeterminate forms, you can differentiate numerator and denominator separately. This often simplifies difficult limits into straightforward calculations.", catId: mathId },
  ];

  for (const item of questions) {
    await client.execute({
      sql: "INSERT INTO questions (category_id, question, answer, long_answer, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      args: [item.catId, item.q, item.a, item.la, adminId, now],
    });
  }

  console.log("Seeded 3 categories with sample questions");
  console.log("Done!");
  client.close();
}

seed().catch(console.error);