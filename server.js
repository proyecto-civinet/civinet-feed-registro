const pool = require("./src/config/db");
pool.query("SELECT NOW()") .then(res  => console.log("✅ Conectado a PostgreSQL:", res.rows)) .catch(err => console.error("❌ Error conexión:", err.message));
```

Guarda y vuelve a ejecutar:
```
node server.js