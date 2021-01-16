<template>
  <div>
    <div class="plans">
        <div>Plans</div>
        <div>
          <select @change="actOnSelectedPlan"  v-model="selectedPlan" class="healtPlans">
            <option v-for="(option,index) in planList" :key="index" :text="option.name"
            :value="option.value">{{ option.name }}</option>
          </select>
        </div>
    </div>
    <div class="NIBSS" v-if="showNibssSection">
        <div>BVN</div>
        <div>
          <input class="bvnField" @keyup="validateBVN" type="text" size="11" v-model="bvnValue">
        </div>
        <div>
          <button class="bvnButton" :disabled="bvnButtonEnabled == false"
          @click="getBVN_details">Validate BVN</button>
        </div>
    </div>
    <div class="invalidBVN" v-if="showInvalidBVNSection">
        <div>Invalid BVN: Please enter a validte BVN</div>
    </div>
    <div class="errorValidatingBVN" v-if="showBVNValidationErroSection">
        <div>Error BVN: Please try again, if there message continues, please contact support</div>
    </div>
  </div>
</template>

<script>
const RelianceRequest = require('../lib/RelianceHMO_Requests');
const Credentials = require('../lib/Credentials');

export default {
  name: 'Main',
  data() {
    return {
      planList: [],
      showNibssSection: false,
      bvnButtonEnabled: false,
      showInvalidBVNSection: false,
      showBVNValidationErroSection: false,
      selectedPlan: '',
      bvnValue: '',
    };
  },
  methods: {
    actOnSelectedPlan() {
      if (this.selectedPlan.toString().trim().length > 0) {
        this.showNibssSection = true;
      } else {
        this.showNibssSection = false;
      }
    },
    validateBVN() {
      const bvnValue = this.bvnValue.toString();
      bvnValue.split('').forEach((character) => {
        if ('1234567890'.indexOf(character) === -1) {
          this.bvnValue = this.bvnValue.toString().split(character).join('');
        }
      });
      if (this.bvnValue.toString().length === 11) {
        this.bvnButtonEnabled = true;
      } else {
        this.bvnButtonEnabled = false;
      }

      this.showNibssSection = !!this.showNibssSection;
    },
    getBVN_details() {
      this.bvnValue = this.bvnValue.toString();
    },
  },
  async mounted() {
    const plans = await RelianceRequest.Plans({
      sandbox_key: Credentials.sandbox_key,
      host: '',
      params: { type: 'family', package: 'custom' },
    });
    this.planList.push({ name: 'Select Plan:.', value: '' });
    // console.log(JSON.stringify(plans));
    if (plans.message === 'OK') {
      plans.data.data.plans.forEach((plan) => {
        const { id, name } = plan;
        this.planList.push({ name, value: id });
        // console.log(`${id} -.- ${name}`);
      });
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
