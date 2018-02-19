<template>
<div>
  <justinNav />
  <div class="container">
    <div class="row">
        <div class="col-lg-12 col-md-12 col-sm-12 text-center mb-4">
            <img src="../assets/equation.svg" alt="Kiwi standing on oval">
        </div>
            <h1><input type="number" step=".0001" min="1" style="text-align: center;" v-model="Fs" placeholder="Sample Rate (Fs)"></h1>
            <h1><input type="number" step="1" min="1" style="text-align: center;" v-model="n" placeholder="Sample Size (n)"></h1>
            <h1><input type="number" step=".0001" min="1" style="text-align: center;" v-model="desiredFt" placeholder="Desired Freq (Ft)"></h1>
            <a @click="calculateFt()" class="btn btn-primary">Calculate Ft</a>
            <h1 v-if="m != null">Bin Number: {{m}}</h1>
            <h1 v-if="AcutalFt != null">Actual Ft: {{AcutalFt}}</h1>
        </div>

        <div>
            <div v-if="success != ''" class="alert alert-success" role="alert">
                {{ success }}
            </div>
            <div v-if="error != ''" class="alert alert-danger" role="alert">
                {{ error }}
            </div>
            <div v-if="information != ''">
                <h3>Information: {{ information }}</h3>
            </div>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 text-center mb-4">
            <hr>
        </div>
    </div>
    <div><p>This will find the closest prime bin to your Ft</p></div>
    <div>Site is in {{producion}} mode</div>    
    <b-button class="glyphicon glyphicon-question-sign"></b-button>
  </div>
</div>
</template>

<script>
import justinNav from "./justinNav.vue";

export default {
  name: "CoherentSamplingCalculator",
  data() {
    return {
      producion: "No data",
      apiURL: "",
      Fs: "",
      n: "",
      desiredFt: "",
      m: null,
      AcutalFt: null,
      success: "",
      error: "",
      information: "",
    };
  },
  methods: {
    calculateFt: function() {

        //Verfiy Numbers
        if(this.Fs == "" || this.n == "" || this.desiredFt == ""){
            this.AddWarning("Input Missing");
            return;
        }

        //Vary m to get Ft close
        //Ft=(m/n)*Fs
        
        for(let m=0; m < this.n; m++){
            if(this.desiredFt > (m/this.n)*this.Fs){
                this.AcutalFt = (m/this.n)*this.Fs;
                this.m = m;
            }
        }
    },
    primeRec(array, lowestPrimeIndex){
        //Checks to see if index extends beyond array (pops back from recursion)
        if(lowestPrimeIndex >= array.length){
            return array;
        }

        //Filter out all numbers that can be divided by lowest prime index
        array = array.filter(x => x%array[lowestPrimeIndex] != 0 || x == array[lowestPrimeIndex]);
        
        //Recursively calls function
        array = this.primeRec(array, lowestPrimeIndex+1);

        return array;
    },
    CalculatePrimeNumbers(primeRoof){
        //Create array of all numbers up to roof
        let arr = [];
        for(let i=2; i < primeRoof; i++){
            arr = arr.concat([i]);
        }

        //Removes all numbers but prime numbers
        arr = this.primeRec(arr, 0)
        
        console.log(arr)
        return(arr);
    },
    AddWarning(warning) {
        this.error = warning;
        setTimeout(() => {this.AddWarning("")}, 5000);
    },
    AddInformation(inputInformation) {
        this.information = "NEW INFORMATION!"
    },
  },
  created: function() {
    this.producion = process.env.NODE_ENV;
    if (process.env.NODE_ENV === "development") {
      this.apiURL = "http://localhost:3000";
    }
    this.CalculatePrimeNumbers(1000);
  },
  components: {
    justinNav
  }
};
</script>

<style scoped>
.btn-default {
  color: #fff;
  border: 2px solid;
  border-color: grey;
  border-radius: 15px;
  box-shadow: 0 9px #999;
  margin-bottom: 30px;
}
.btn-default:hover {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  -webkit-transform: scale3d(1.2, 1.2, 1.2);
  transform: scale3d(5);
}

.btn-default:active {
  box-shadow: 0 5px #666;
  transform: translateY(4px);
}
</style>

