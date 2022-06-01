import migrate_1 from "./001";

const migrates = [migrate_1];

export default async function migrate(vm: Vue) {
  const version = vm.$store.state.app.version;
  const pendingMigrates = migrates.filter(
    (migration) => migration.version > version
  );

  for (const migration of pendingMigrates) {
    await migration.migrate(vm);
  }
}
