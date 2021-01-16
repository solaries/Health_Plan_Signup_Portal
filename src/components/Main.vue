<template>
  <div>
    <div class="plans">
        <div><h1>Avialable Plans</h1></div>
        <div>Plans List</div>
        <div>
          <select @change="actOnSelectedPlan"  v-model="selectedPlan" class="healtPlans">
            <option v-for="(option,index) in planList" :key="index" :text="option.name"
            :value="option.value">{{ option.name }}</option>
          </select>
        </div>
    </div>
    <div class="NIBSS" v-if="showNibssSection">
        <div><h1>BVN Validation</h1></div>
        <div>BVN:</div>
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
    <div class="PlanForm" v-if="showPlanFormSection">
        <div><h1>Customer Informatiion Form</h1></div>
        <div>First Name</div>
        <div>
          <input class="firstName"  @keyup="validateFormFieldsFirstName"
           type="text" size="20" v-model="firstName" >
        </div>
        <div>Last Name</div>
        <div>
          <input class="lastName"   @keyup="validateFormFieldsLastName"
            type="text" size="20" v-model="lastName"  >
        </div>
        <div>Email</div>
        <div>
          <input class="email"   @keyup="validateFormFieldsEmail"
            type="text" size="50"  v-model="email" >
        </div>
        <div>Phone</div>
        <div>
          <input class="phone"   @keyup="validateFormFieldsPhone"
          type="text" size="11"  v-model="phone" >
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
      showNibssSection: false,
      bvnButtonEnabled: false,
      planSubmitButtonEnabled: false,
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
      this.bvnValue = this.removeNonNumeric(this.bvnValue.toString());
      if (this.bvnValue.toString().length === 11) {
        this.bvnButtonEnabled = true;
      } else {
        this.bvnButtonEnabled = false;
      }
    },
    validateFormFieldsFirstName() {
      if (this.firstName.toString().length <= 20 && this.firstName.toString().length >= 1) {
        this.planSubmitButtonEnabled = true;
      } else {
        this.planSubmitButtonEnabled = false;
      }
    },
    validateFormFieldsLastName() {
      if (this.lastName.toString().length <= 20 && this.lastName.toString().length >= 1) {
        this.planSubmitButtonEnabled = true;
      } else {
        this.planSubmitButtonEnabled = false;
      }
    },
    validateFormFieldsEmail() {
      if (this.email.toString().length <= 50 && this.email.toString().length >= 5) {
        this.planSubmitButtonEnabled = true;
      } else {
        this.planSubmitButtonEnabled = false;
      }
    },
    validateFormFieldsPhone() {
      this.phone = this.removeNonNumeric(this.phone.toString());
      if (this.phone.toString().length === 11) {
        this.planSubmitButtonEnabled = true;
      } else {
        this.planSubmitButtonEnabled = false;
      }
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
      this.showInvalidBVNSection = false;
      this.showBVNValidationErroSection = false;
      this.showPlanFormSection = false;

      const reset = await NibssRequest.Reset({
        sandbox_key: Credentials.sandbox_key,
        organisation_code: Credentials.organisation_code,
        host: '',
      });
      if (reset.ivkey == null) {
        this.showBVNValidationErroSection = true;
      } else {
        const validate = await NibssRequest.VerifySingleBVN({
          bvn: this.bvnValue.toString(),
          sandbox_key: Credentials.sandbox_key,
          organisation_code: Credentials.organisation_code,
          password: reset.password,
          ivkey: reset.ivkey,
          aes_key: reset.aes_key,
          host: '',
        });
        if (!validate.message === 'OK') {
          this.showBVNValidationErroSection = true;
          this.firstName = validate.data.FirstName;
          this.lasstName = validate.data.LastName;
          this.phone = validate.data.PhoneNumber;
        } else {
          this.showPlanFormSection = true;
        }
      }
    },
    async submitForm() {
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
      } else {
        this.showPlanFormSection = true;
        this.showFormSubmitSuccessSection = false;
        this.showFormSubmitErrorSection = true;
      }
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
