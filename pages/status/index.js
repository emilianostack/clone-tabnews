import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DataBase />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";
  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAtText} </div>;
}

function DataBase() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let maxConnections, openedConnections, databaseVersion;

  if (!isLoading && data) {
    const { database } = data.dependencies;
    maxConnections = database.max_connections;
    openedConnections = database.opened_connections;
    databaseVersion = database.version;
  }

  return (
    <div style={{ paddingTop: 10 }}>
      <h1>Database</h1>
      Informações do banco de dados:
      <ul style={{ paddingTop: 0, margin: 0 }}>
        <li>Conexões utilizadas: {maxConnections}</li>
        <li>Conexões abertas: {openedConnections}</li>
        <li>Versão do banco: {databaseVersion}</li>
      </ul>
    </div>
  );
}
