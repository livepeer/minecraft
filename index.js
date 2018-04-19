import accountsURL from "./accounts.bin";
import { uint32ArrayToAddrs } from "./utils";

main();

function main() {
  console.log(accountsURL);
  const progress = document.querySelector("#progress");
  progress.style.width = progress.innerText = "0%";
  fetch(accountsURL)
    .then(res => {
      return res.arrayBuffer();
    })
    .then(buf => {
      // console.log(buf);
      const { byteLength } = buf;
      // const xs = new Uint32Array(buf);
      const offset = 20;
      const totalAddrs = byteLength / offset;
      const maxAddrs = Infinity;
      // const maxAddrs = 100000;
      const len = Math.min(totalAddrs, maxAddrs);
      for (let i = 0; i < len; i++) {
        setTimeout(() => {
          const xs = new Uint32Array(buf, offset * i, 5);
          // console.log(i + "| " + uint32ArrayToAddrs(xs));
          // console.log(`${i / len * 100}%`);
          progress.style.width = progress.innerText = `${parseInt(
            (i + 1) / len * 100,
            10
          )}%`;
          // if (i === len - 1) {
          //   window.alert(`done! parsed ${i + 1} addresses`);
          // }
        }, 100);
      }
    });
}
