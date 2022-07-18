import Unathorized from "./pages/Unauthorized";
import Authorized from "./pages/Authorized";
import { checkLogin } from "./utils/storage";

function App() {
  return checkLogin() ? <Authorized /> : <Unathorized />;
}

export default App;
