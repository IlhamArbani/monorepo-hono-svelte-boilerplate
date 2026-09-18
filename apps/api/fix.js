const fs = require('fs');

const files = [
  'src/modules/auth/auth.repository.ts',
  'src/modules/users/users.repository.ts',
  'src/modules/roles/roles.repository.ts',
  'src/modules/articles/articles.repository.ts',
  'src/modules/portfolios/portfolios.repository.ts',
  'src/modules/experiences/experiences.repository.ts',
  'src/modules/master-data/categories.repository.ts',
  'src/modules/master-data/skills.repository.ts',
  'src/modules/master-data/permissions.repository.ts'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/where:\s*\([^)]+\)\s*=>\s*(.*?),/g, "where: (table, { sql }) => sql`${$1}`,");
  
  // Actually wait, let me just replace it to use eq directly, but I need eq imported.
  // Wait, if I do where: eq(...), in RAW: eq(...), I need to import eq.
  // The eq import was removed by the agent! Oh no!
  fs.writeFileSync(file, content);
}
console.log("Done");
