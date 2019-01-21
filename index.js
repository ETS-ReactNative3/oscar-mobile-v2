import { Navigation } from "react-native-navigation";
import App from "./App";

Navigation.registerComponent(`ocsar.app`, () => App);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [{
          component: {
            name: "ocsar.app"
          }
        }]
      }
    }
  });
});
