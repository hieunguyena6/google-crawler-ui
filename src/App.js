import Unathorized from "./pages/Unauthorized";
import { checkLogin } from "./utils/storage";

function App() {
  return checkLogin() ? <p>hehe</p> : <Unathorized />;
}

export default App;
