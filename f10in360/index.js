import React from "react";
import { AppRegistry, StyleSheet, Text, View } from "react-360";

export default class f10in360 extends React.Component {
  state = { price: null };

  async componentDidMount() {
    const data = await fetch(
      "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=GOOG&interval=60min&apikey=A5NSDOLF1YBCDTTV"
    );
    const json = await data.json();
    const keys = ["Time Series (60min)", "2019-03-22 15:30:00", "1. open"];
    const result = json[keys[0]][keys[1]][keys[2]];
    this.setState({ price: Number(result) });
  }

  render() {
    const { price } = this.state;
    console.log(12123, price);
    return (
      <View style={styles.panel}>
        <View style={styles.greetingBox}>
          <Text style={styles.color}>GOOG: {(price || 0).toString()} USD</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  panel: {
    // Fill the entire surface
    width: 1000,
    height: 600,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    justifyContent: "center",
    alignItems: "center"
  },
  color: {
    color: "#000"
  },
  greetingBox: {
    padding: 100,
    backgroundColor: "#fff",
    borderColor: "#fff",
    borderWidth: 2
  },
  greeting: {
    fontSize: 30
  }
});

AppRegistry.registerComponent("f10in360", () => f10in360);
