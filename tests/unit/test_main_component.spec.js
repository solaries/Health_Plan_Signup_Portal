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
    /*when the component loads it does a http get to retreive plans. 
    these plans (at least one) would be loaded to the plans dropdown. the test finishes before 
    the HTTP request is complete. This loop makes the test wait for the HTTP request to compele
    */
    do {
      await sleep(1000);
    } while (wrapper.find('.healtPlans').element.innerHTML === '');
    // console.log(wrapper.find('.healtPlans').element);
    expect(wrapper.find('.healtPlans').element.length > 1).toBe(true);
  }, 10000);

  it('check if NIBSS section is visible', () => {
    expect(wrapper.find('.NIBSS').element == null).toBe(true);
  });
  it('select plan and result in th NIBSS sectin being visible', async () => {
    wrapper.find('.healtPlans').element[1].selected = true;
    wrapper.find('.healtPlans').trigger('change');
    //ensure the v-if of the  NIBSS section to validates and renders changes
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.NIBSS').element == null).toBe(false);
  });
  it('select no plan and result in the NIBSS section being invisible', async () => {
    wrapper.find('.healtPlans').element[0].selected = true;
    wrapper.find('.healtPlans').trigger('change');
    //ensure the v-if of the  NIBSS section to validates and renders changes
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.NIBSS').element == null).toBe(true);
  });

  it('check if BVN textbox exists', async () => {
    wrapper.find('.healtPlans').element[1].selected = true;
    wrapper.find('.healtPlans').trigger('change');
    //ensure the v-if of the  NIBSS section to validates and renders changes
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.bvnField').element.value).toBe('');
  });
  it('check if BVN validation button exists', async () => {
    expect(wrapper.find('.bvnButton').element.value).toBe('');
  });

});
