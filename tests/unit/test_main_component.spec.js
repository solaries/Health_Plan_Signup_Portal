import { shallowMount } from '@vue/test-utils';
import Main from '@/components/Main.vue';

const wrapper = shallowMount(Main);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe('Validate Plans drop down', () => {
  it('check if plans drop down exists', () => {
    expect(wrapper.find('.healtPlans').element.value).toBe('');
  });

  it('wait for plan retreival, check plans dropdown population', async () => {
    /* when the component loads it does a http get to retreive plans. 
    these plans (at least one) would be loaded to the plans dropdown. the test finishes before 
    the HTTP request is complete. This loop makes the test wait for the HTTP request to compele
    */ 
    let checkCount = 0;
    do {
      await sleep(1000);
      checkCount += 1;
    } while (wrapper.find('.healtPlans').element.innerHTML === '' && checkCount < 11);
    // console.log(wrapper.find('.healtPlans').element);
    expect(wrapper.find('.healtPlans').element.length > 1).toBe(true);
  }, 12000);

  it('check if NIBSS section is visible', () => {
    expect(wrapper.find('.NIBSS').element == null).toBe(true);
  });
  it('select plan and result in th NIBSS sectin being visible', async () => {
    wrapper.find('.healtPlans').element[1].selected = true;
    wrapper.find('.healtPlans').trigger('change');
    // ensure the v-if of the  NIBSS section to validates and renders changes
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.NIBSS').element == null).toBe(false);
  });
  it('select no plan and result in the NIBSS section being invisible', async () => {
    wrapper.find('.healtPlans').element[0].selected = true;
    wrapper.find('.healtPlans').trigger('change');
    // ensure the v-if of the  NIBSS section to validates and renders changes
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.NIBSS').element == null).toBe(true);
  });
});
describe('Validate BVN Section', () => {
  it('check if BVN textbox exists', async () => {
    wrapper.find('.healtPlans').element[1].selected = true;
    wrapper.find('.healtPlans').trigger('change');
    // ensure the v-if of the  NIBSS section to validates and renders changes
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.bvnField').element.value).toBe('');
  });
  it('check if BVN validation button exists', async () => {
    expect(wrapper.find('.bvnButton').element.value).toBe('');
  });
  it('check if BVN textbox is than 11 digits', async () => {
    wrapper.find('.bvnField').setValue('12345678901');
    wrapper.find('.bvnField').trigger('keyup');
    // ensure the BVN field text change has affected the BVN button accordingly
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.NIBSS').element.innerHTML.indexOf('disabled="disabled"') > -1).toBe(false);
  });
  it('check if BVN textbox is less than 11 digits', async () => {
    wrapper.find('.bvnField').setValue('123');
    wrapper.find('.bvnField').trigger('keyup');
    // ensure the BVN field text change has affected the BVN button accordingly
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.NIBSS').element.innerHTML.indexOf('disabled="disabled"') > -1).toBe(true);
  });
  it('check if BVN textbox is greater than 11 digits', async () => {
    wrapper.find('.bvnField').setValue('123456789012');
    wrapper.find('.bvnField').trigger('keyup');
    // ensure the BVN field text change has affected the BVN button accordingly
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.NIBSS').element.innerHTML.indexOf('disabled="disabled"') > -1).toBe(true);
  });
  it('check if non numerics are removed from BVN textbox', async () => {
    wrapper.find('.bvnField').setValue('1A3A5B7B9c1C');
    wrapper.find('.bvnField').trigger('keyup');
    // ensure the BVN field text change has affected the BVN button accordingly
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.bvnField').element.value === '1A3A5B7B9c1C').toBe(false);
  });
  it('check if Plan Form section is visible', () => {
    expect(wrapper.find('.PlanForm').element == null).toBe(true);
  });
  it('check if Invalid BVN section is visible', () => {
    expect(wrapper.find('.invalidBVN').element == null).toBe(true);
  });
  it('check if BVN validation Error section is visible', () => {
    expect(wrapper.find('.errorValidatingBVN').element == null).toBe(true);
  });
  it('Validate entered BVN', async () => {
    wrapper.find('.bvnField').setValue('12345678901');
    wrapper.find('.bvnField').trigger('keyup');
    // ensure the BVN field text change has affected the BVN button accordingly
    await wrapper.vm.$nextTick();
    // then check that BVN button is enabled
    expect(wrapper.find('.NIBSS').element.innerHTML.indexOf('disabled="disabled"') > -1).toBe(false);
    wrapper.find('.bvnButton').trigger('click');

    let checkCount = 0;
    do {
      await sleep(1000);
      // ensure the BVN button click has affected the plan form, invalid BVN,
      // or BVN validation error section accordingly
      await wrapper.vm.$nextTick();
      checkCount += 1;
    } while ((wrapper.find('.PlanForm').element == null
    && wrapper.find('.invalidBVN').element == null
    && wrapper.find('.errorValidatingBVN').element == null) === true && checkCount < 11);
    const effectOfBvnValidation = (wrapper.find('.PlanForm').element == null
    && wrapper.find('.invalidBVN').element == null
    && wrapper.find('.errorValidatingBVN').element == null);
    expect(effectOfBvnValidation).toBe(false);
  }, 12000);
});
describe('Validate Plan Form Section', () => {
  it('check if first name textbox exists', async () => {
    expect(wrapper.find('.firstName').element.value).toBe('');
  });
  it('check if last name textbox exists', async () => {
    expect(wrapper.find('.lastName').element.value).toBe('');
  });
  it('check if email textbox exists', async () => {
    expect(wrapper.find('.email').element.value).toBe('');
  });
  it('check if phone number textbox exists', async () => {
    expect(wrapper.find('.phone').element.value).toBe('');
  });
  it('check if phone number textbox exists', async () => {
    expect(wrapper.find('.phone').element.value).toBe('');
  });
  it('check if Plan Form Submission button exists', async () => {
    expect(wrapper.find('.submitForm').element.value).toBe('');
  });
  it('check if first name textbox is less than 1 character', async () => {
    wrapper.find('.firstName').setValue('');
    wrapper.find('.firstName').trigger('keyup');
    // ensure the first name field text change has affected the BVN button accordingly
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.PlanForm').element.innerHTML.indexOf('disabled="disabled"') > -1).toBe(true);
  });
  it('check if first name textbox is more than 20 characters', async () => {
    wrapper.find('.firstName').setValue('ikemefunaoyemajukwukamarama');
    wrapper.find('.firstName').trigger('keyup');
    // ensure the first name field text change has affected the BVN button accordingly
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.PlanForm').element.innerHTML.indexOf('disabled="disabled"') > -1).toBe(true);
  });
  it('check if first name textbox is below or equal 20 characters', async () => {
    wrapper.find('.firstName').setValue('samson');
    wrapper.find('.firstName').trigger('keyup');
    // ensure the first name field text change has affected the BVN button accordingly
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.PlanForm').element.innerHTML.indexOf('disabled="disabled"') > -1).toBe(false);
  });
  it('check if last name textbox is less than 1 character', async () => {
    wrapper.find('.lastName').setValue('');
    wrapper.find('.lastName').trigger('keyup');
    // ensure the first name field text change has affected the BVN button accordingly
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.PlanForm').element.innerHTML.indexOf('disabled="disabled"') > -1).toBe(true);
  });
  it('check if last name textbox is more than 20 characters', async () => {
    wrapper.find('.lastName').setValue('ikemefunaoyemajukwukamarama');
    wrapper.find('.lastName').trigger('keyup');
    // ensure the first name field text change has affected the BVN button accordingly
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.PlanForm').element.innerHTML.indexOf('disabled="disabled"') > -1).toBe(true);
  });
  it('check if last name textbox is below or equal 20 characters', async () => {
    wrapper.find('.lastName').setValue('adeline');
    wrapper.find('.lastName').trigger('keyup');
    // ensure the first name field text change has affected the BVN button accordingly
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.PlanForm').element.innerHTML.indexOf('disabled="disabled"') > -1).toBe(false);
  });
  it('check if email textbox is less than 5 characters', async () => {
    wrapper.find('.email').setValue('');
    wrapper.find('.email').trigger('keyup');
    // ensure the first name field text change has affected the BVN button accordingly
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.PlanForm').element.innerHTML.indexOf('disabled="disabled"') > -1).toBe(true);
  });
  it('check if email textbox is more than 50 characters', async () => {
    wrapper.find('.email').setValue('ikemefunaoyemajukwukamarama@yahooforthelifeofmewhenishould.com');
    wrapper.find('.email').trigger('keyup');
    // ensure the first name field text change has affected the BVN button accordingly
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.PlanForm').element.innerHTML.indexOf('disabled="disabled"') > -1).toBe(true);
  });
  it('check if email textbox is below or equal 50 characters but more than 5 characters', async () => {
    wrapper.find('.email').setValue('adeline@yahoo.com');
    wrapper.find('.email').trigger('keyup');
    // ensure the first name field text change has affected the BVN button accordingly
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.PlanForm').element.innerHTML.indexOf('disabled="disabled"') > -1).toBe(false);
  });
  it('check if phone textbox is less than 11 digits', async () => {
    wrapper.find('.phone').setValue('123');
    wrapper.find('.phone').trigger('keyup');
    // ensure the first name field text change has affected the BVN button accordingly
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.PlanForm').element.innerHTML.indexOf('disabled="disabled"') > -1).toBe(true);
  });
  it('check if phone textbox is more than 11 digits', async () => {
    wrapper.find('.phone').setValue('123456789012345');
    wrapper.find('.phone').trigger('keyup');
    // ensure the first name field text change has affected the BVN button accordingly
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.PlanForm').element.innerHTML.indexOf('disabled="disabled"') > -1).toBe(true);
  });
  it('check if phone textbox is below or equal 20 digits', async () => {
    wrapper.find('.phone').setValue('12345678901');
    wrapper.find('.phone').trigger('keyup');
    // ensure the first name field text change has affected the BVN button accordingly
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.PlanForm').element.innerHTML.indexOf('disabled="disabled"') > -1).toBe(false);
  });
  it('check if successful form submission section is visible', () => {
    expect(wrapper.find('.formSubmitSuccessful').element == null).toBe(true);
  });
  it('check if successful form submission error section is visible', () => {
    expect(wrapper.find('.formSubmitError').element == null).toBe(true);
  });


  it('Validate plan form submit', async () => {
    wrapper.find('.firstName').setValue('John');
    wrapper.find('.firstName').trigger('keyup');
    wrapper.find('.lastName').setValue('Doe');
    wrapper.find('.lastName').trigger('keyup');
    wrapper.find('.email').setValue('testuser1@kang.pe');
    wrapper.find('.email').trigger('keyup');
    wrapper.find('.email').setValue('testuser1@kang.pe');
    wrapper.find('.email').trigger('keyup');
    wrapper.find('.phone').setValue('08132646940');
    wrapper.find('.phone').trigger('keyup');
    // ensure the text field changes has affected the Submit Form button accordingly
    await wrapper.vm.$nextTick();
    // then check that Submit Form button is enabled
    expect(wrapper.find('.PlanForm').element.innerHTML.indexOf('disabled="disabled"') > -1).toBe(false);
    wrapper.find('.submitForm').trigger('click');

    let checkCount = 0;
    do {
      await sleep(1000);
      // ensure the submit Form button click has affected the plan form, form submission successful,
      // or form submission error section accordingly
      await wrapper.vm.$nextTick();
      checkCount += 1;
    } while ((wrapper.find('.PlanForm').element != null
    && wrapper.find('.formSubmitSuccessful').element == null
    && wrapper.find('.formSubmitError').element == null) === true && checkCount < 11);
    const effectOfFormSubmission = (wrapper.find('.PlanForm').element != null
    && wrapper.find('.formSubmitSuccessful').element == null
    && wrapper.find('.formSubmitError').element == null);
    expect(effectOfFormSubmission).toBe(false);
  }, 12000);

});
