import './index.scss';
import VConsole from 'vconsole';
import Cookies from 'js-cookie';
import tp from './index.html';

const PUGLIN_ID = 'vconsole-atzuche-env';
const PUGLIN_NAME = '切换环境';
const COOKIE_ENV_NAME = '__at__env__';
const envs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let $;
let parentsNode = [];

// 查找父节点
function findParentNode(dom) {
  // 每次查找之前先清空父节点的内容
  parentsNode = [];
  parentsNode.push(dom);
  findNode(dom);
}

function findNode(dom) {
  if (dom) {
    const parent = dom.parentNode;
    if (parent) {
      parentsNode.push(parent);
      findNode(parent);
    }
  }
}

class VConsoleAtzucheEnv extends VConsole.VConsolePlugin {
  constructor(instance, options = {}) {
    super(PUGLIN_ID, PUGLIN_NAME);

    if (!instance) {
      console.error('需要VConsole实例');
      return;
    }

    this.vConsole = instance;

    $ = this.vConsole.$;

    this.currentEnv = '';

    this.vConsole.addPlugin(this);
  }

  // 初始化渲染tab
  onRenderTab(callback) {
    let $dom = (this.$dom = $.render(tp, {
      envs: envs,
      current: this.currentEnv || Cookies.get(COOKIE_ENV_NAME)
    }));

    callback($dom);

    // 设置当前开发环境的显示
    this.initEnv();

    $.bind($.all('.at-radio-wrapper', $dom), 'click', e => {
      e.preventDefault();
      findParentNode(e.target);
      const wrapper = parentsNode.find(item => {
        return item.className.includes('at-radio-wrapper');
      });

      if (!wrapper) {
        return;
      }
      this.currentEnv = wrapper.id;
      this.showEnvInTab();
    });
  }

  // 底部添加确定按钮
  onAddTool = callback => {
    let button = {
      name: '确定',
      onClick: event => {
        Cookies.set(COOKIE_ENV_NAME, this.currentEnv);
        location.reload();
      }
    };
    callback([button]);
  };

  // 初始化显示当前环境
  initEnv = () => {
    this.currentEnv = Cookies.get(COOKIE_ENV_NAME);
    this.showEnvInTab();
  };

  // 更新显示环境的ui
  showEnvInTab = () => {
    $.removeClass($.all('.at-radio-wrapper'), 'at-radio-wrapper-checked');
    $.removeClass($.all('.at-radio-wrapper .at-radio'), 'at-radio-checked');
    $.addClass($.all(`#${this.currentEnv}`), 'at-radio-wrapper-checked');
    $.addClass($.all(`#${this.currentEnv} .at-radio`), 'at-radio-checked ');
  };
}

export default VConsoleAtzucheEnv;
