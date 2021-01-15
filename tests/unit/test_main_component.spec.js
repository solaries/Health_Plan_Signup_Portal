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
    await wrapper.vm.$nextTick();
    // console.log(wrapper.find('.NIBSS').element.innerHTML);
    expect(wrapper.find('.NIBSS').element == null).toBe(false);
  });
});
