<template>
<div>
    <justinNav />
    <div class="container">
        <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 text-center mb-4">
                <img src="../assets/equation.svg" alt="Kiwi standing on oval">
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 text-center mb-4">
                <h1><input v-on:keyup.enter="calculateFt()" type="number" step=".0001" min="1" style="text-align: center;" v-model="Fs" placeholder="Sample Rate (Fs)"></h1>
                <h1><input v-on:keyup.enter="calculateFt()" type="number" step="1" min="1" style="text-align: center;" v-model="n" placeholder="Sample Size (n)"></h1>
                <h1><input v-on:keyup.enter="calculateFt()" type="number" step=".0001" min="1" style="text-align: center;" v-model="desiredFt" placeholder="Desired Freq (Ft)"></h1>
            </div>
            
            <div class="col-lg-12 col-md-12 col-sm-12 text-center mb-4">
                <a @click="calculateFt()" class="btn btn-primary">Calculate Ft</a>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-4 col-md-4 col-sm-4 text-center mb-4">
                <h1>Best Prime Fit</h1>
                <h2 v-if="mPrime != null">Bin: {{mPrime}}</h2>
                <h2 v-if="AcutalFtPrime != null">Ft: {{AcutalFtPrime}}</h2>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-4 text-center mb-4">
                <h1>Best Fit</h1>
                <h2 v-if="mClosest != null">Bin: {{mClosest}}</h2>
                <h2 v-if="AcutalFtClosest != null">Ft: {{AcutalFtClosest}}</h2>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-4 text-center mb-4">
                <h1>Best Odd Fit</h1>
                <h2 v-if="mOdd != null">Bin: {{mOdd}}</h2>
                <h2 v-if="AcutalFtOdd != null">Ft: {{AcutalFtOdd}}</h2>
            </div>
        </div>

        <div class="col-lg-12 col-md-12 col-sm-12 text-center mb-4">
            <img v-if="loading == true" src="../assets/loading3.gif" alt="loading"> 
        </div>

        <div class="row">
            <div v-if="success != ''" class="alert alert-success" role="alert">
                {{ success }}
            </div>
            <div v-if="error != ''" class="alert alert-danger" role="alert">
                {{ error }}
            </div>
            <div  class="alert alert-success" v-if="information != ''">
                <h3>{{ information }}</h3>
            </div>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 text-center mb-4">
            <hr>
        </div>
    </div>
    <div><p>This will find the closest prime bin to your Ft</p></div>
    <div>Site is in {{producion}} mode</div>    
    <b-button @click="information = 'This was designed by Justin Hynes-Bruell with the mentorship of Richard Liggerio'" class="glyphicon glyphicon-question-sign"></b-button>
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

      mPrime: null,
      AcutalFtPrime: null,
      mClosest: null,
      AcutalFtClosest: null,
      mOdd: null,
      AcutalFtOdd: null,
      
      success: "",
      error: "",
      information: "",
      loading: false,
    };
  },
  methods: {
    calculateFt: function() {
        let Fs = this.Fs;
        let n = this.n;
        let desiredFt = this.desiredFt;

        //Verfiy Numbers
        if(Fs == "" || n == "" || desiredFt == ""){
            this.AddWarning("Input Missing");
            return;
        }
        this.loading = true;

        //This equation is KING!
        //Ft=(m/n)*Fs
        setTimeout(() => {
        //Best fit bin to Ft
        let closestArray = [];
        for(let m=1; m < n; m++){
            closestArray = closestArray.concat([m])
        }
        this.mClosest = closestArray[this.BinarySeachFt(closestArray)];
        this.AcutalFtClosest = (this.mClosest/n)*Fs;

        //Best fit odd bin to Ft
        let oddArray = [];
        for(let m=1; m < n; m+=2){
            oddArray = oddArray.concat([m])
        }
        this.mOdd = oddArray[this.BinarySeachFt(oddArray)];
        this.AcutalFtOdd = (this.mOdd/n)*Fs;


        //Closest prime bin to Ft
        let primeArray = this.CalculatePrimeNumbers(n);
        console.log(primeArray);
        this.mPrime = primeArray[this.BinarySeachFt(primeArray)];
        this.AcutalFtPrime = (this.mPrime/n)*Fs;


        this.loading = false;

        }, 200);
    },
    BinarySeachFt(array){
        var minIndex = 0;
        var maxIndex = array.length - 1;
        var currentIndex;
    
        while (minIndex <= maxIndex) {
            currentIndex = (minIndex + maxIndex) / 2 | 0;


            let currentElement = (array[currentIndex]/this.n)*this.Fs;
            let nextElement = (array[currentIndex+1]/this.n)*this.Fs;
            let previousElement = (array[currentIndex-1]/this.n)*this.Fs;      

            let currentElementDiff = Math.abs(currentElement-this.desiredFt);
            let nextElementDiff = Math.abs(nextElement-this.desiredFt);
            let previousElementDiff = Math.abs(previousElement-this.desiredFt);

            // console.log("Next: " + nextElementDiff + " Index: " + (currentIndex+1) + " Bin Number: " + array[currentIndex+1]);
            // console.log("Current: " + currentElementDiff + " Index: " + currentIndex + " Bin Number: " + array[currentIndex]);
            // console.log("Previous: " + previousElementDiff + " Index: " + (currentIndex-1) + " Bin Number: " + array[currentIndex-1]);
            
            if(nextElementDiff < currentElementDiff) {
                minIndex = currentIndex + 1;
            }
            else if(previousElementDiff < currentElementDiff){
                maxIndex = currentIndex - 1;
            }
            else {
                return currentIndex;
            }
        }
    
        return -1;
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

        return(arr);
    },
    AddWarning(warning) {
        this.error = warning;
        setTimeout(() => {this.AddWarning("")}, 5000);
    },
    AddInformation(inputInformation) {
        this.information = inputInformation;
    },
  },
  created: function() {
    this.producion = process.env.NODE_ENV;
    if (process.env.NODE_ENV === "development") {
      this.apiURL = "http://localhost:3000";
    }


    //For testing purposes
    this.Fs = 48000;
    this.n = 13230;
    this.desiredFt = 1000;
    this.calculateFt();

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

