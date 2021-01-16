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
    // ensure the BVN button click has affected the plan form, invalid BVN,
    // or BVN validation error section accordingly
    await wrapper.vm.$nextTick();

    let checkCount = 0;
    do {
      await sleep(1000);
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
