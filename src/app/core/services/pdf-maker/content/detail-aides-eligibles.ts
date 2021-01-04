
import { Injectable } from '@angular/core';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { AideSociale } from '@app/commun/models/aide-sociale';
import { SimulationAidesSociales } from '@app/commun/models/simulation-aides-sociales';
import { AidesService } from '../../utile/aides.service';
import { Style } from '../models/style';
import { Cell } from '../models/table/cell';
import { Table } from '../models/table/table';
import { TableElement } from '../models/table/table-element';
import htmlToPdfmake from 'html-to-pdfmake';
import { Text } from '../models/text';
import { Figure } from '../models/figure/figure';
import { Line } from "../models/figure/elements/line";

@Injectable({ providedIn: 'root' })
export class DetailAidesEligiblesService {

  constructor(
    private aidesService: AidesService
  ) {

  }

  public addPagesDetailAides(content: Array<any>, simulationAidesSociales: SimulationAidesSociales): void {
    if (this.aidesService.hasAide(simulationAidesSociales, CodesAidesEnum.AGEPI)) {
      this.addAideAGEPI(content, simulationAidesSociales);
    }
    if(this.aidesService.hasAide(simulationAidesSociales, CodesAidesEnum.AIDE_MOBILITE)) {
      this.addAideMobilite(content, simulationAidesSociales);
    }
    if(this.aidesService.hasAide(simulationAidesSociales, CodesAidesEnum.PRIME_ACTIVITE)) {
      this.addPrimeActivite(content, simulationAidesSociales);
    }

  }

  private addAideAGEPI(content: Array<any>, simulationAidesSociales: SimulationAidesSociales): void {
    this.addPageBreak(content);
    const aide = this.aidesService.getAideByCode(simulationAidesSociales, CodesAidesEnum.AGEPI);
    const imageBase64 = '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';
    this.addTableTitle(content, aide, imageBase64, '#FFC6FF');
    this.addContentAideAGEPI(content, aide);
  }

  private addAideMobilite(content: Array<any>, simulationAidesSociales: SimulationAidesSociales): void {
    this.addPageBreak(content);
    const aide = this.aidesService.getAideByCode(simulationAidesSociales, CodesAidesEnum.AIDE_MOBILITE);
    const imageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABgCAYAAADrc9dCAAAAAXNSR0IArs4c6QAAEnNJREFUeAHtXXmQFFcdft09x+7sCQjLwiYBAsaQwwQCwZAIlpo7JmrIYZWlVd4pU7GMRqtSZQ6tMrEsrdIyapV/hGgSBdR4xRBLYTHESISQJRAJt+FYQJZd9pqeo9vv+828Ts/s7OwMTJhh7VfV8+7r+/r3ru7pn6FO0biua/iLeOihhzz/Aw884I/y3CtXrvTSeIE16Fi2bJlbqFnooxeMPuakMQwjx+8lLNFxUsBoEjT4BJ4gowNq7dq1UubSpUvVxo0bT6r8EttetWTz58930U+pH/100XdF8jRRmqSTISdUTq/8RJCEuXPnGpMnTxbQZ82aZWzbts3o6OgQ/969e41JkyapUCiUQ8rhw4dz/OXUX420bW1tOXd8KpVy0TeFfko4+uyi73S7S5YsUUePHpVwkgO8pMnlEFMSOH4iSAIlAcagBNTX1xuxWMwk8JZlGaZpyoVGGL29veKWVmV/GO/317rbcZwMqtmG0t/a2gpIXJduXul02iVRQ0NDzvDwsEsJQnKRHBJWjsQUBcdPBCUChumFiJaWFrOurs7s6ekx29vbjcSermjLgY1L0vbg9aabPk857lRXuVNxmzQy47gxhjFgKKNbmUa3Y1jbrWjDs33T53dGZl5sHzp0yJ04caITj8edvr4+RxODvstwVgoxoxLiJ0MPTU1NTYYmIhwOm/39/Vbrvhenho/s/JrhpJYB/KZxA3w5HTGMftcMrUxOmf1o7zlXdAOndDKZ9IgBTi6HslKkpSAh+WRgiOL8YHJoikajJsiwnO5dsei2576i7PhdhqFi5bR/vKbFlDGkonWP2XOv/a459dwhkJK2bdvhUIab2sHkPyYpIwgZjYzm5mbrxIkTFoYpq2X/y9PC+7f8XDnp+eMV3FPql2ltTHZc9PG+jgUHMXylgV0a2KVLIaUgIVzOZidvkQySAcmwBgcHQ62v//nd1vE3n3Idd9opNXqcZzZM42C69Zw7e+de09XQ0JCCpBQkJX8FZvpxoXQUIoNEYPUQfsfRLdPNnjefDsjwo1bYTYzM4/t+ScyIHTHkjc2hn1MAb3hirUckXYonIb4IA5sec8qUKaaWDBYYOnG4sbHrd89gmJqnMwd2CQiY1qaBi2++JdXcNoAtQlJLypEjRxxsKh2UIMtqLSk5EkLGkMDgaooTOOcMMovhKhx7ffW9ARklEJCfBDcwsSOGxJKYEltiTKyzmHu58iWEfnPnzp0Wxj2LkoHMEWvPho7orpdeAJnBasqDrhyHMWSfu+jK9MyF+7HiSlBSQE569uzZaZQiUpIjIXruQKRM4tzwcWkLVkNYuoXD/9l8b0BGOQTkp3VjxJBYElNiS4w5nxBzSomeMkRCsh5POiBOMokjPBqO9zU3bVqxCTnG1447H7O32e9ih98/77Z5ybqWE5AGm1KCDWMqX0ostgMJTOwkDayZTZzTWBCrEM5mwoiKtu7qfJ853CeHV29zm8d18bjbI2G7/5XBiTP3AlsH0uJCStwdO3a469evV6tWreJJuWtqUeGpLQ8KeTaFg0IZsmCHjKGeD45rpE5j54glMeWQBUvOAYm5PjEnF3rskuEKx8ohLMvCiIg0NjbWJRKJ2KQNy58yUonLTmO7x21Vbijyr2MLP/GxSCQyNDAwEMfIlMCckpwxY0YKnZbJXZa9fLjEo3QKBI/QMWyZsGlChuNMHrcIneaOEUtiSmCzGAvmxJ4csDlCCJ9vUHSQjglMzCUWpMPCswtLuQEhFeMNWBJTYkuMiTUxJ/bZZ0zK1BsTiJE8TMomEgnBg5cQCAn2HpViBFgSU0oIjMzVfGBH7FkFuRAJweyeERdE0iARHXJVqi1BORkENK5ZjL0nqpoDTuokxeSEjok8jOVYFDv0GMQohuVZY0vnYy8HYFYOgb4ldy3AKDQAjIeA8RBWXDYmeG9iFwnRb4fwGbg2ICaQkMrx4JVECcliK1ATc0ZqDoQQBoA1ER9NCIKYUBIzPjAVQ0Bw1ThzdiD2unSPEB2AXbpOK7YOD+zKIOAHl1jnl2rq9W9+BP2YQ0ZkKJQuCCsdgWKYkgtPQvJfYMM4R1EqvaYgZUkIEFNi60/sxz4HcY5nSChShbWxP0/griACxBYv2Hmjl79oT0L8gdpdTLx0msAuD4GxMC1KSHlVBakrgUBASCVQrGAZASEVBLMSRQWEVALFCpYREFJBMCtRVEBIJVCsYBk5+5AKlnvSRfUOxtXzr+7y8i+9YIaa0tLg+fMdR/sG1ZqteyW4PhJS1106R4Ws0u+zl3ceUHuO9Er+Oe2T1KUzp+ZXcVr9NUfIL9Z1qfuf+psHwpdvWqQeuG2p5893bD94TH3mx3/wgh++Y6m654ZFnr+YY1d3j7r2W0+qVJqPs5X63NXzq05I6bdSsZ5VMG752ldzSnty3RYPsJyIUTzf+/1L6jikrBTzzZXryiq7lDJPNU1NEfLSG/vVG7jjaTj80BzGkLR6805xl/LTOxRX3//DP8ZM+sqebvXbDf8eM93pTlBThDy+ZrPX/y/f9B7PnS81XsQojp8+v1Ed6DkxSmwm+MFfrS0aX63ImiGkD3f2M9k7dkJDnfrSjYvUjMmtgstfXt2tDvb0j4lR+4TM267xZEp9+zcvjJp+LRYBvGjaiiwYJMFp/qkZQla+uE0NJ/i+mFIfvvxdKhKy1O2LLxC/gz/vcbIfy1xzyWz1zmmTJBnnnu0H/jsiC94hUH7p+OJ1C0ekqWZAzRDyhG8y/9hVFwkmty++0MOGhBDMYobPDh68bYkkIYkPrugckfyZDdsV5w+aWxedry44e8qINNUMqAlCNu/tVq/uOyw4zGqboBbMni7uc6fSnfkr476jfWrNa3vHxOqG+e9UC+dk8j+7aYf6JxYK2nB5+81VGZK4V7n/1vfqqJqxa4IQv3TceeVbUkGU7rwyIy10lzq5P3z7UiYX8w3f5P3zzi61q/u4hH9y6bsVya81U3VChuykWrF+q4eLnjd0wEcwrISzO+8/bXxD/ffEkI4a1X7PeWepay+dLfFcSj/3yk7MT0n1yG8zE30sGlb33bJ41PzVjAhVs3LWzZVVfzwhzWiJRRWXrPlmYmO97EeSGHKefmGLuvv6y/OTjPBzLuH+hdPOoyCCQ15374Ck+8LVl6m21syKbETGKgdUnRD/3qNvyFY/eq74i5JPYNgphZDzOybLcPfU37eoTZjE9xzNnFdxSX3PjWMTWi1eqkoIl6X/3HFA+s5l7uJ3nTUqDhuQbhDDG3fy/9j+puKwNJa5/6NXqV+/tE3ZybQ6PpA5TuGGsyVWN1bWqsVXlRD/JH3DvDnq8btvGRWIex9frX7211cknvlKIaRjUrP67Afnqx8+u0HyTZvQJP5RK6mBiKpN6olUGvPBax4Ed16Vu7ryIrKOO3yrL8473NmXYr568xWKR/hcUf3gU9epuuwZWSl5q5GmahLyR6yYegaGpc/vaI6p9180q2j/uTchqLsPH5cdPXf2n/7AvKJ5GMnh6Xdfv2PMdLWSoGoSovcenDu++qErSnqodB/udn0KrPPXCpCVaoexYsUKC98MJDFhfCORryvW4Q3GGK4G/NunacLff7K+UpUF5Sh1/KrPL8a/p/rx5uIgLm6q4seOHeO6P7l7926nahISkFMYgYCQwrhULTQgpGrQF644IKQwLlULDQipGvSFKw4IKYxL1UIDQqoGfeGKA0IK41K10ICQqkFfuOKAkMK4VC00IKRq0BeuOCCkMC5VCy1KCP5TXfxFqKo1+8yteCxMcwihchJt8JEt6TW+Aph5aHHmYlA7LTdMeWWG2Gqcibm/gR4h+ap98Nkgao1RphnOvI7uzxW4TwoBwwz1EFNi6y/Ajz0/DJ8T6U9I8XIsKyDED8opuIllsSGLXHgSouvBp8W1NGXscP0+HRfYp4aACyz94BLr/BI9QiBKouBKZ0BCJnbTLe0v5mcK/CeHQBZLwVXjzDmE2OsShZCs8iqltY8xMcY5zvCOPfPyTW52MtKZArt8BIihYAlMs9gKJ8ScpWkOLH6SBn4D31s08FFfE2zx86UhpA7hmXrYCEVCUPo13UwOzym/GUEOjYATm/CXxNmXroNE2IDcBsQJYJzE8/UUvr+Y7urqcpcvX56ZQ6itkhn1she2SAclBCY9OOuKJ/GpwNJehNItCGwPAWJHDIklMc3iKnsMQs2EmgNrzZo19Bvd3d0GVSjwA43IYPGCoaSEVawlFT5xoMGM92f+0sQcgSkZgfSE9t/YMxa+ACxtYBoHCTauJC/409Al4uD77y5JkTkEn5ZTEButsdIBMWl8ZCuNDGm8DpREQan4hdf/UkVjO0puRZAwgwAwI3bEkFgSU2JLjDE9OJgWXGJPDmjG/Bg/38/ihXGv0eo71NH42h+/o1LJiZnagt+iCITCPQMX3ngfVlf7QcgAyOC7WIMgpPjH+PGJa4UvKyt8JdOhIkSyh6FLGCWrYDEJO5Fqnno4PvvKRxQqKtqQIBLf3Q33xM9977eJGbHLYkgcAW0yRYyJNTEn9uSAhh9LlkmFqkEpOtTlSlFCJooUSUmAURtOG+ltu+38HYMX33y/G4m99UESKSr40QgQG2JkTz2PXzwQ7Iih3NQAMoutQ6yJudYwTS645OVBlyx94RSFYH6VR0hUn71isPkx+QYs2eqNpN1U9/rqW8M9+69GCVGWExjDTk7seD5+/jWr3HC0H9gPY9IeBL5D2WsY9jBwHFXlkbdTz4qMi5NIFww62Jdw8kmhwASZZSEAPA4yhkFKnBUOXXTT08MLlt2Xbm7rhK6L/9tTYfadGBALYkJsiBGxImbEjhgSS2JKbIkxsUa8aJLWN7NICD35UuJXm4fCo4jn347q9QX261EBwxgXMdPJuuiBrgtCx9+8xLD7p2GH2aKcBC5nfEmPadrKjPQ5oVCfG206mJpw1mZ7+sVbHSssGnOAh+0jg4TIBVLiwMvGnFFUbV7O/0MoJdT5TV3gYJdKwmTZS4UjqIR+IZDHxyicG5s0KkzBTkGdT9KeseBf8XMu24yVBE8AKH0yFMKth0QEnbEG3ZQvF8hdDaeDuz6NrmX6jz0FeibzLLCJIz4OKeBmOo4JnPuPBOaLZBZT0beOOK1n3QMlX0IYUVD1KgiJ4GglArBFWlAhbd79UTQsAncEdgjxITRSCIHbI4XlsvAz2AgRaL+LfuqTDN6wKfQzhT4nYPOpnhyNwE87jngspmwZrnBjj6l61ZMQZAamopxYQXEud40OFB8q6MPlppFqeRRYZho5T4GVhhSlMA5KY1BxGA2iQjGWSXV8WimMSAclDPnli86IO2MM+sUNs/QdjWb3aTxCSAbSyK4b7mR2RSrEIFyIQL+TwJDpPI3RW7du9aSD2GtARty1qMzA0DWq+m6IH5W+hCkxIERIQEMiqJTSEUbhorsKtok0lBASo+vRtq7/TLEFMDKBBuM5kwzX6K6cTcmwjr7KFoHkcGWLNAkM7RyikuWo7x4BEAkhSoVI0QruqT4UkiGnwSBFiCAhaIyFhnHIgjOjNglFkQ8DjZSP+9Nm+WeKQffkUTbtLCG0SIZICfrNIQvdFkJIBlemlBTqUE9xzsAo40kGjkhcjDwu52piAGg86RB/IWBQYUFSqOWYR/RgXrSBojILFZMTtAG3BLSP0aASIQSSJHMICWE98IuNPIWqrbkw9EfaxEUMHZoQ+D1CyAT6Q4sb6TSHcO7CgZVsAPVuHNOAMxYZrGPUuzWfFGqjpMrplpYWExWSFBO6XEX1G4mhXj7aMJzFTDTIoK3J0DYrpcn3Z0Jr5zcLvtcg7aeNm5JHHmKDBzlqguoisUGKA5xknwE8ZDUFnGQ3XkwydEWjEsIEqFviOXxBxBhEvyih1MRQVWt7e7uBpbKogYO0CAmZEYuwGwYan1MPw1hYrRtNgm4nn4FrkxmxsN4HAbyAh3Po0CE5etJEZJ8CUrr0BC6Shu6Lrcv12yUB4ycGoqeVIAox3KNwKAMRopiSRGgyqPCKbn+F+X5/XC26Cby/XfTrR91084KUyHNxHhTybEoTwSP1UqTCX7637PUH5rs1oyCGUWSbEuPu3r1bFOtyiUwtYyQH46kQQIJwibIxf3l+bTL+8Fp1+9+ZYhshDS7U3IlNP+YMOZQlCTy15UEh3cBINtlMo/GjeyxTEiG6EF1wlhiyzyjuWRTJofpQNEoIYZhWBafzn4k2bqARzdbgMwL9lIdLDOvs7NRpuYoqiwidMWc40YHl2Ho403koPdqdnXe017Mhyl4aL7AGHaO9RMi7XxuOFNpNW9+0/rBy3P8DJlvXYWKLBsoAAAAASUVORK5CYII=';
    this.addTableTitle(content, aide, imageBase64, '#F1A378');
    this.addContentAideMobilite(content, aide);
  }

  private addPrimeActivite(content: Array<any>, simulationAidesSociales: SimulationAidesSociales): void {
    this.addPageBreak(content);
    const aide = this.aidesService.getAideByCode(simulationAidesSociales, CodesAidesEnum.PRIME_ACTIVITE);
    const imageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABgCAYAAADrc9dCAAAAAXNSR0IArs4c6QAAEZ5JREFUeAHtXXlsHNUdfjOzu75jx8ZnTJKGRKDQUiAgAaJNQkkQ7R89REDcUi9VIFSptKkQLUf/oBS1lRAtUGi5Ko42UQuoJCWcrhLu0Ig2CeAQEhJiO04cH+v1njP9vp/3TWfX9tqbXSdrM08av/v6vvm9a9bvZ6gCjeM4hreI22+/3fXfeuut3ijXvW7dOjeNG1iCjjVr1jjjNQt9dIPRx4w0hmFk+N2EU3QcFTCaBA0+gSfI6IB69dVXpcwVK1aorVu3HlX5U2z7cUu2bNkyB/2U+tFPB31XJE8TpUk6GnIC+fTKSwRJWLp0qdHY2CigL1q0yNixY4fR3t4u/j179hgNDQ0qEAhkkNLT05Phz6f+45G2ubk5441PJpMO+qbQTwlHnx30nW5n+fLlqre3V8JJDvCSJudDzJTA8RJBEigJMAYloKKiwqisrDQJvGVZhmma8qARRn9/v7ilVek/jPf6S91t2/YoqumG0l9XVwdIHIduPqlUyiFRkUjEHhkZcShBSC6SQ8LykZic4HiJoETAML0QUVtba5aXl5t9fX1ma2urcfhwvOzw/pblibjxVeWYJ+PlaFF40LJqZpwtBgCEgUK3gUcZ9gfBkLOhob27o6EhFOvq6nLq6+vtaDRqDwwM2JoY9F2Gs6kQMyEhXjL00FRTU2NoIoLBoDk0NGT1dTe3jAxU/dR2zDUgoWa2AJ9PP0DOkGnY6ypqh39V39LTDZxSiUTCJQY4ORzKpiIt4xKSTQaGKM4PJoemsrIyE2RYQ9125b59J/w4kTSuM5RRmU8HZmtaRzmRYMC598QTD/26psWMgJRULBazOZThpbYx+U9KyhhCJiJjzpw51uDgoIVhyuo/2NQ2cKjqz1jxLput4BbSL6x8t9aeMHx1XdPBAxi+UsAuBexSUyFlXEK4nE1P3iIZJAOSYQ0PDwd697V8MTxQ/gSGp7ZCGj3b82IYO1A9J3p54/zu96qqqpKQlHFJyV6BmV5gKB3jkUEisHoIRgba5oUHyp70yfCiNr6bGIUHy54iZsSOGPLF5tDPKYAvPLHWI5IuxZUQT4SBTY/Z1NRkaslggYnBQPUne1qfBmdn6sy+PTkCGL7enb+w6xvBOckwtggJLSkHDx60sam0UYIsq7WkZEgIGUMCg6spTuCcM8gshqvgp/uabvTJmJyA7BTEjNgRQ2JJTIktMSbWaczdbNkSQr+5a9cuC+OeRclA5lDP/vL2w911m8Glv5pyocvDYahIQ0v/+c3t0f1YccUpKSAntXjx4hRKESnJkBA9dyBSJnFu+Li0BasBLN2CA701N/pk5EFAdlK8yMSQWBJTYkuMOZ8Qc0qJnjJEQtIeVzogTjKJI7zMcYJz9myf9y7yzaoddzZm0+93wgtP/fRMw0gMQhpilBJsGJPZUmKxIUhgYidpYM1s4pzGglgFcDYTRFTZof0tKxOxoBxeTX+jZ3MNRigRC/27vHpgD7C1IS0OpMTp7Ox0tmzZotavX8+TcsfUosJTWx4U8mwKB4UyZMEOxKPBVbMZpmPZN2JJTDlkwZJzQGKuT8zJhR67ZLjCsXIAy7IgIkLV1dXl8Xi88pP3Fzxhp6yzjmXDZ2tdppV6Z/4pe68IhUKRcDgcxcgUx5ySWLhwYRJ9lsldlr38uMSjdLAmR+gYtkwcpdMEHMdsnK0AHet+EUtiSmDTGAvmxJ4csD1CCL9vUHSQjglMzCUWpMPCtwtLOYZPSLGYA5bElNgSY2JNzIl9+huTMvXGBGIkH5PSiURC8OEFEuLvPYrGB7AkppQQGJmr+cGO2LMOciESgtl9VFwQSYNEdMhTrMb45YwioHFNY+x+UdUccFInKSYndEzkQSzHyrBDr4QYVWJ5Vt257cS3fTCLh8CS0/edjVEoDIwjwDiCFVcME7w7sYuE6F+H8Bu4NiDGl5Di8eCWRAlJYytQE3NGag6EEAaANREfTQiCmFASM943RUNAcNU4c3Yg9rp0lxAdgF26Tiu2Dvft4iDgBZdYZ5dq6vVvdgT9mEPGZBgvnR82dQRyYUouXAnJ/gEbxjmK0tRr8lNOCQFiSmy9ib3YZyDO8QwJRaqwNvbm8d1FRIDY4gd27ujlLdqVEG+gducSL53Gt/NDYDJMcxKSX1V+6mIg4BNSDBSLWIZPSBHBLEZRPiHFQLGIZfiEFBHMYhTlE1IMFItYRsY+pIjlHlVRIyNh9dpbz47JG7CCqqlxvmptWaTqaqf+vSwc7ldvbt3glnfGaV9R9XObXX8pOkqKkCP9PeqO31yZE6f6ua3q6st+rr520fcUvobmTLvxxYfU/Q/d6Ka5/JKb1HevucP1l6Jjxg1ZfUe61N33X6du+Ml5OIKI58R0w6Y/ZsQ//9IjKpXi7wlK15Q0Iffc9bp67P5O9fC9O9Wdt/0TUvF9xc/8NB/sels98sQtEyL73x1b1Cf7d0p8WWj0F7Ak8423n5swTylElDQhnDPmtS1W89tPUWefeZH60fV/UNdefpuL27Mb7nPd2Y7nNj3oBl2x5ibXveGFTKlxI0rEUdKEjIfRxau+4wZHRgZVz8G9rl87wsMDqmPzOvHWVNery761VrU2LxL/W1s3qt7Dn+qkJWfPOEIqK+dkgDgcGczw0/NyxxMqFo9I+IrzL1XBYEhduOIq8dt2Sj3/4sPiLsU/M46Q9z98y8XRwnL4xHknu37t8E7mqy+4VoJXrbxaRyuuvvDjDtdfSo4ZRciB7t3qngducPFbesq58va7AXB8+NG7qnM3fqwPM691iVp6yjmjbsxFS08+V9zdPR+rrdteFHep/cm9kD/OrSX4ZaEKfEpOqJ7everDzndUIhmTVoUQzkk+22RKxzUZ0asuuEbt+OB1CduASf+sM0rvd+QlTUjH5r9mAKo9nKBv+MHvZPWlw2hHYxH10quPp4MMd97QaVZ+6TL1+wd/CILjasubz6j+gd68dv66nOm0S5oQ7spxc4qyAkHV3LhAtbctUUsWL1MXX/jtMUMVQeLKiisvmqqqWvX3f9wjbu+fOTUNivsRkrLp5cfUpd/8/07em+54uUuakAfu3qbm1jVNGRvv3mN4uF+tf+a3OfNufOFPPiE5ESogcu++nWr7zi1SQjBQpk77/JcnLG37+6+raDQsO/n/7NisvrD0/AnTHuuIkpaQfMDwTubnnfN1dcvav0yY/e77rlfPbrxX4pmvlAiZUcveiRDmISPnA21Wr8xcXelwbXv3JJx3uLMvFTMrCNnyxtNqcOiQYFpX2yTnXrkA5t6EexQa7ui5sy8VMysI0QeGnDuuvPTmSb+TEPyrLvsZ9jijp8De4e54E1NSc0hb60nqpWfzP9K46xeb8sZxNTaJfErNzAoJKTVQC2mPT0gh6E1DXp+QaQC1kCJ9QgpBbxry+oRMA6iFFOkTUgh605DXJ2QaQC2kSJ+QQtCbhrw+IdMAaiFF+oQUgt405PUJmQZQCynSJ6QQ9KYhb05C8D/V+Z/0TUMjZ1ORk2GaQQiVk2iDS7YEB0M5I7MJkOPZF9wHLz+nJLYaZ2LubZNLSLZqH1wbRK0xyrDUYW8G3330CBim00dMia23FC/2vBg+I9KbkOKFQnxCvKAU4CaWuYYscuFKiK4HV4traRI7ELDH/rxcJ/btvBAgll5wiXV2AS4hECVRcKUzICETO+WVI69lZ/L9R4dAGkvBVePMOYTY6xKFkLTyKqW1jzExxjnO8HZj+9C7ynBGf9uvc/l2/ggAQ2JJTNPYEmbR+MbCNAcWr6SB38B9iwYu9TXBFq8vxW2kTgA3aAZ5c2z4SMW8VNIa/ZlG/k3xcwCBsvLEC3Obwv+CRMQAeQwQx4FxAreTJnH/Yuq9995zHn300dE5hNoqiZpe9sIW6UAGOlNzWw4/jp/YRn1kjw4BYkcMiSUxTeMqewxCzVI1B9Yrr7xCv9Hd3W1QhQIvaEQGiw8MJSVYVm4no+GKqkTcOpWJfZMfApVV8b81tA5uBpYxYBoFCTE8CT7wp6BLxMb97w5JkTkEV8spiI3WWGmDmBQu2UohQwqXmiVQULJ90eGnsErozK8pfmpiRuyIIbEkpsSWGGN6sKkllNiTA5pJL+NHIVV8MO5VR8Kh9u6Pm+5KpYx6H+rJEbAsp6/lcwfXVlbH94OQMMgY5gNCcl/GjyuuFW5WVrgl06YiRLKHoUsYJatgMQE7XlEV62lq77+TFU3enM92CmLU2H7kl8SM2KUxJI6ANpEkxsSamBN7ckDDy5JlUqFqUIoOdblSlJCJIkVS4mA0Bif/lyxWPTfc2XZS781WIPWRlOD/GYMAsSFGNXOHdxEzYkcMiSUxTWNrE2tirjVMkwsueXnQJUtfOEUhmFflERJVpJ9K2LxMvgpLtgo7YdQc2Ft/SSRcvhoaFMpYzmfeGE6ssjq6qW1B33oz6AwB+xFM2sPAN5J+RmCPAMcJVR65O/W0yDg4iXTAoI19CSefJAqMk1kWAsCjIGMEpERZ4byTDj254ORDayGWHaapPrOnwuw7MSAWxITYECNiRcyIHTEklsSU2BJjYo140SStX2aREHqypcSrNg+FQzmYU45kFfoB+xWogGGMC0G4yvt6qk8dCVecnoibbY5t1dopoxbCN6ukB6NKzLScAcNMDQRD9oGK6pFt9c3h7djFicYc4BHzkEFC5AEpUeAVw5yRU21exq/fKSXU+U1d4GCXSsJk2UuFI6iEfiGQx8conBsb6uFLwsZc4yROaA2/4zhD27CS4AkApU+GQrj1kIigGWvQTbltQN5qOG289Sl0TfqP/V0CPZN5FthEER+FFHAzHcUEzv1HHPNFIo2p6FtHnNaz7oKSLSGMGFf1KggJ4WglBLBFWlAhbb79ZWhYCO4Q7ADiA2ikEAK3SwrLZeEz2AgRaL+DfuqTDL6wSfQziT7HYfOrnhyNwE87ingspmIyXOHFnlT1qishyAxMRTmxguJc7hptKD5U0IfLTSPV8uAfYbiBHz1PgZWCFCUxDkpjUHEQDaJCMZbJO5S0UhiRDkoY8suNzoibMQb94oZZ+o5Gs/s0LiEkA2lk1w13Ir0iFWIQLkSg3wlgyHSuxujt27e70kHsNSBj3lpUZmDomlB9N8SPSl+ClBgQIiSgISFUSukIonDRXQXbRBpKCInR9Whb1z9TbAGMTKDBNvoqhKC/PJuSYR19lS0CyeHKFmniGNo5RCXyUd89BiASQpTGI0UruKf6UEiGnAaDFCGChKAxFhrGIQvOUbVJKIp8GGikXO5Pm+XPFIPuyads2jRoNy1wMXoAi35zyEK3hRCSwZUpJYU61JOcMzDKuJKBIxIHI4/DuZoYABqxNR7jgoMKxyWFWo55RA/mRRsoKrNQMTlBG/BKQPsYDSoRQiBJMoeQEFYIv9jIo+svaRv9kfZxEUMHmaAFv0sImUB/aHEjneIQzl04sJINoN6NYxqwJyODdYxLCCOySaE2Sqqcrq2tNVEhSTGhy1VUv5EY6uWjDcNZzESDDNqaDG2zbJps/2ho6fxNg+82SPtp46XkkYfY4EGOmqC6SGyQYgMn2WcAD1lNASfZjeeSDF3RhIQwAeqWeA5fEDEG0S9KKDUxVNXa2tpqYKksauAgLULC6IhF2A0Djc+oh2EsrNSNJkG3k9/AtRkdsbDeBwF8gIfd1dUlR0+aiPRXQJEqYChbCpaF7ovE6XK99pSA8RID0dNKEIUY7lE4lIEIUUxJIjQZVHhFt7fCbL83rhTdBN7bLvr1p266+UBK5Ls4Dwp5NqWJ4JH6VKTCW7677PUGZrs1oyCGUVyuUWKc3bt3i2JdLpGpZYzkYDwVAkgQHlE25i3Pq03GG16qbu9vpthGSIMDNXdi0485Qw5lSQJPbXlQSPdUJYJleM2UCNEZsogh+4zinkWRHKoPRaOEEIZpVXA6/0y08QKNabYGnxHop3xcYlhHR4dOy1VUzqFJJ8y2M4aT7Mip+PVwptNSerQ7Pe9or2tDlN00bmAJOib6ESHffm04Umg3bf3SesPycf8PUhpxaJvOSzwAAAAASUVORK5CYII=';
    this.addTableTitle(content, aide, imageBase64, '#BDB2FF');
    this.addContentPrimeActivite(content, aide);
  }

  private addTableTitle(content: Array<any>, aideSociale: AideSociale, imageBase64: string, colorLineTitle: string): void {
    let body = new Array<Array<Cell>>();
    const row = new Array<Cell>();
    row.push(this.createCell1(imageBase64));
    row.push(this.createCell2(aideSociale));
    body.push(row);
    content.push(this.createTableElement(body));
    this.createLineTitle(content, colorLineTitle);
  }

  private createTableElement(body: Array<Array<Cell>>): TableElement {
    const tableElement = new TableElement();
    tableElement.style = 'tableStyle1';
    tableElement.layout = 'noBorders';

    const table = new Table();
    table.widths = ['auto', '*'];
    table.body = body;
    tableElement.table = table;

    return tableElement;
  }

  private createCell1(imageBAse64: string): Cell {
    const cell = new Cell();
    cell.image = `data:image/jpeg;base64,${imageBAse64}`;
    cell.width = 60;
    cell.height = 60;
    return cell;
  }

  private createCell2(aideSociale: AideSociale): Cell {
    const cell = new Cell();
    cell.text = `\n${aideSociale.nom} (${aideSociale.organisme})`;

    const style = new Style();
    style.color = '#23333C';
    style.fontSize = 16;
    style.bold = true;
    cell.style = style;


    return cell;
  }

  private addContentAideAGEPI(content: Array<any>, aideAGEPI: AideSociale): void {
    const contentDetailAide = htmlToPdfmake(aideAGEPI.detail);
    contentDetailAide[1].text = '\n' + contentDetailAide[1].text + '\n';
    contentDetailAide[3].text = '\n' + contentDetailAide[3].text + '\n';
    contentDetailAide[5].text = '\n' + contentDetailAide[5].text + '\n';
    content.push(contentDetailAide);
  }

  private addContentAideMobilite(content: Array<any>, aideAGEPI: AideSociale): void {
    const contentDetailAide = htmlToPdfmake(aideAGEPI.detail);
    contentDetailAide[1].text = '\n' + contentDetailAide[1].text + '\n';
    contentDetailAide[3].text = '\n' + contentDetailAide[3].text + '\n';
    contentDetailAide[5].text = '\n' + contentDetailAide[5].text + '\n';
    contentDetailAide[8].text = '\n' + contentDetailAide[8].text + '\n';
    contentDetailAide[10].text = '\n' + contentDetailAide[10].text + '\n';
    content.push(contentDetailAide);
  }

  private addContentPrimeActivite(content: Array<any>, aideAGEPI: AideSociale): void {
    const contentDetailAide = htmlToPdfmake(aideAGEPI.detail);
    contentDetailAide[1].text = '\n' + contentDetailAide[1].text + '\n';
    contentDetailAide[3].text = '\n' + contentDetailAide[3].text + '\n';
    contentDetailAide[7].text = '\n' + contentDetailAide[7].text + '\n';
    content.push(contentDetailAide);
  }

  private addPageBreak(content: Array<any>): void {
    const text = new Text();
    text.text = '';
    text.pageBreak = 'after';
    content.push(text);
  }

  private createLineTitle(content: Array<any>, colorLine: string): void {
    const figure = new Figure(new Array<any>());
    const line = new Line(
      77,
      -25,
      550,
      -25,
      5,
      colorLine

    );
    figure.canvas.push(line);
    content.push(figure);
  }

}