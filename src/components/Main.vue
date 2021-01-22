<template>
  <div>
    <div class="NIBSS" v-if="showNibssSection">
        <div><label for="bvnField">BVN Validation</label></div>
        <div>BVN:</div>
        <div>
          <input id="bvnField" class="bvnField" @keyup="validateBVN" type="text" size="11" v-model="bvnValue">
        </div>
        <div>
          <button class="bvnButton" :disabled="bvnButtonEnabled == false"
          @click="getBVN_details">Validate BVN</button>
        </div>
    </div>
    <div class="plans"  v-if="showPlans">
        <div><h1>Avialable Plans</h1></div>
        <div>Plans List</div>
        <div>
          <select @change="actOnSelectedPlan"  v-model="selectedPlan" class="healtPlans">
            <option v-for="(option,index) in planList" :key="index" :text="option.name"
            :value="option.value">{{ option.name }}</option>
          </select>
        </div>
    </div>
    <div class="invalidBVN" v-if="showInvalidBVNSection">
        <div>Invalid BVN. Please enter a validte BVN</div>
    </div>
    <div class="errorValidatingBVN" v-if="showBVNValidationErroSection">
        <div>Error occured during BVN validation.
           Please try again, if there message continues, please contact support</div>
    </div>
    <div class="PlanForm" v-if="showPlanFormSection">
        <div><h1>Customer Informatiion Form</h1></div>
        <div>First Name</div>
        <div>
          <input class="firstName"  @keyup="validateFormFields"
           type="text" size="20" v-model="firstName" >
           <input  class="firstNameValidFlag"   type="hidden" v-model="firstNameValidFlag" />
        </div>
        <div>Last Name</div>
        <div>
          <input class="lastName"   @keyup="validateFormFields"
            type="text" size="20" v-model="lastName"  >
           <input  class="lastNameValidFlag"   type="hidden" v-model="lastNameValidFlag" />
        </div>
        <div>Email</div>
        <div>
          <input class="email"   @keyup="validateFormFields"
            type="text" size="50"  v-model="email" >
           <input  class="emailValidFlag"   type="hidden" v-model="emailValidFlag" />
        </div>
        <div>Phone</div>
        <div>
          <input class="phone"   @keyup="validateFormFields"
          type="text" size="11"  v-model="phone" >
           <input  class="phoneValidFlag"   type="hidden" v-model="phoneValidFlag" />
        </div>
        <div>
          <button @click="submitForm" class="submitForm"
          :disabled="planSubmitButtonEnabled == false">
          Submit Plan</button>
        </div>
    </div>
    <div class="formSubmitSuccessful" v-if="showFormSubmitSuccessSection">
        <div>Form Submited successfully</div>
    </div>
    <div class="formSubmitError" v-if="showFormSubmitErrorSection">
        <div>Error Submiting form: Please try again, if
          there message continues, please contact support</div>
    </div>
  </div>
</template>

<script>
const RelianceRequest = require('../lib/RelianceHMO_Requests');
const NibssRequest = require('../lib/NIBSS_Requests');
const Credentials = require('../lib/Credentials');

export default {
  name: 'Main',
  data() {
    return {
      planList: [],
      showNibssSection: true,
      bvnButtonEnabled: false,
      planSubmitButtonEnabled: false,
      showPlans: false,
      showInvalidBVNSection: false,
      showBVNValidationErroSection: false,
      showPlanFormSection: false,
      showFormSubmitSuccessSection: false,
      showFormSubmitErrorSection: false,
      selectedPlan: '',
      bvnValue: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      firstNameValidFlag: 'no',
      lastNameValidFlag: 'no',
      emailValidFlag: 'no',
      phoneValidFlag: 'no',
    };
  },
  methods: {
    async loadPlans() {
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
    actOnSelectedPlan() {
      if (this.selectedPlan.toString().trim().length > 0) {
        this.showPlanFormSection = true;
      } else {
        this.showPlanFormSection = false;
      }
    },
    validateBVN() {
      this.bvnValue = this.removeNonNumeric(this.bvnValue.toString());
      if (this.bvnValue.toString().length === 11) {
        this.bvnButtonEnabled = true;
      } else {
        this.bvnButtonEnabled = false;
      }
    },
    validateFormFields() {
      if (this.firstName.toString().length <= 20 && this.firstName.toString().length >= 1) {
        this.planSubmitButtonEnabled = true;
        this.firstNameValidFlag = 'yes';
      } else {
        this.planSubmitButtonEnabled = false;
        this.firstNameValidFlag = 'no';
        return true;
      }
      if (this.lastName.toString().length <= 20 && this.lastName.toString().length >= 1) {
        this.planSubmitButtonEnabled = true;
        this.lastNameValidFlag = 'yes';
      } else {
        this.planSubmitButtonEnabled = false;
        this.lastNameValidFlag = 'no';
        return true;
      }
      if (this.email.toString().length <= 50 && this.email.toString().length >= 5) {
        this.planSubmitButtonEnabled = true;
        this.emailValidFlag = 'yes';
      } else {
        this.planSubmitButtonEnabled = false;
        this.emailValidFlag = 'no';
        return true;
      }
      this.phone = this.removeNonNumeric(this.phone.toString());
      if (this.phone.toString().length === 11) {
        this.planSubmitButtonEnabled = true;
        this.phoneValidFlag = 'yes';
      } else {
        this.planSubmitButtonEnabled = false;
        this.phoneValidFlag = 'no';
        return true;
      }
      return true;
    },
    removeNonNumeric(bvnValue) {
      // const bvnValue = this.bvnValue.toString();
      let result = bvnValue;
      bvnValue.split('').forEach((character) => {
        if ('1234567890'.indexOf(character) === -1) {
          result = result.split(character).join('');
        }
      });
      return result;
    },
    async getBVN_details() {
      this.firstName = '';
      this.lasstName = '';
      this.phone = '';
      this.showPlans = false;
      this.showInvalidBVNSection = false;
      this.showBVNValidationErroSection = false;

      const reset = await NibssRequest.Reset({
        sandbox_key: Credentials.sandbox_key,
        organisationCode: Credentials.organisation_code,
        host: '',
      });
      if (reset.ivkey == null) {
        this.showBVNValidationErroSection = true;
      } else {
        const validate = await NibssRequest.VerifySingleBVN({
          bvn: this.bvnValue.toString(),
          sandbox_key: Credentials.sandbox_key,
          organisationCode: Credentials.organisation_code,
          password: reset.password,
          ivkey: reset.ivkey,
          aesKey: reset.aesKey,
          host: '',
        });
        if (validate.message === 'OK') {
          this.firstName = validate.data.FirstName;
          this.lastName = validate.data.LastName;
          this.phone = validate.data.PhoneNumber;
          this.loadPlans();
          this.showPlans = true;
        } else if (validate.message.indexOf('Unmatched Request,') > -1) {
          this.showInvalidBVNSection = true;
        } else {
          this.showBVNValidationErroSection = true;
        }
      }
    },
    async submitForm() {
      this.showPlans = true;
      this.showNibssSection = true;
      this.showPlanFormSection = true;
      this.showFormSubmitSuccessSection = false;
      this.showFormSubmitErrorSection = false;
      let {
        firstName, lastName, email, phone,
      } = this;
      // the signup service in the sandbox is hardcoded
      // to expect an exact structure and set of field value set
      // this is why i am hardcodeing these values
      firstName = 'John';
      lastName = 'Doe';
      email = 'testuser1@kang.pe';
      phone = '08132646940';
      const paramsValue = {
        data: {
          Referral_code: '1122345',
          enrollees: [
            {
              payment_frequency: 'monthly',
              first_name: firstName,
              last_name: lastName,
              email_address: email,
              phone_number: phone,
              plan_id: 22,
              can_complete_profile: true,
              dependants: [
                {
                  first_name: 'Janet',
                  last_name: 'Dependant',
                  email_address: 'testuser2@kang.pe',
                  phone_number: '08132646940',
                  plan_id: 22,
                },
                {
                  first_name: 'Fred',
                  last_name: 'Dependant',
                  email_address: 'testuser3@kang.pe',
                  phone_number: '08132646940',
                  plan_id: 24,
                },
              ],
            },
            {
              payment_frequency: 'q',
              first_name: 'Ben',
              last_name: 'Stiller',
              email_address: 'snr22325@awsoo.com',
              phone_number: '08132646940',
              plan_id: 24,
              can_complete_profile: false,
              dependants: [],
            },
          ],
        },
      };
      const response = await RelianceRequest.SignUp({
        sandbox_key: Credentials.sandbox_key,
        host: '',
        payload: paramsValue,
      });
      if (response.message === 'OK') {
        this.showPlanFormSection = false;
        this.showFormSubmitSuccessSection = true;
        this.showFormSubmitErrorSection = false;
        this.showPlans = false;
        this.showNibssSection = false;
      } else {
        this.showPlanFormSection = true;
        this.showFormSubmitSuccessSection = false;
        this.showFormSubmitErrorSection = true;
      }
    },
  },
  // async mounted() {
  // },
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
