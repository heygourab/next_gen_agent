import { app } from "./src/server.ts";
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
