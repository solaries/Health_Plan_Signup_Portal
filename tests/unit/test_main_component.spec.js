import { shallowMount } from '@vue/test-utils';
import Main from '@/components/Main.vue';

const wrapper = shallowMount(Main);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe('Validate Plans drop down', () => {
  it('check if plans drop down exists', async () => {
    expect(wrapper.find('.healtPlans').element.value).toBe('');
  });

  it('wait for plan retreival, check plans dropdown population', async () => {
    do {
      await sleep(1000);
    } while (wrapper.find('.healtPlans').element.innerHTML === '');
    console.log(wrapper.find('.healtPlans').element);
    expect(wrapper.find('.healtPlans').element.length > 1).toBe(true);
  });
});
