"use strict";
const obsidian = require("obsidian");
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.data === data)
    return;
  text2.data = data;
}
function set_input_value(input, value) {
  input.value = value == null ? "" : value;
}
function set_style(node, key, value, important) {
  if (value == null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, important ? "important" : "");
  }
}
function select_option(select, value, mounting) {
  for (let i = 0; i < select.options.length; i += 1) {
    const option = select.options[i];
    if (option.__value === value) {
      option.selected = true;
      return;
    }
  }
  if (!mounting || value !== void 0) {
    select.selectedIndex = -1;
  }
}
function select_value(select) {
  const selected_option = select.querySelector(":checked");
  return selected_option && selected_option.__value;
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, cancelable, detail);
  return e;
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail, { cancelable = false } = {}) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail, { cancelable });
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
      return !event.defaultPrevented;
    }
    return true;
  };
}
const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
  targets.forEach((c) => c());
  render_callbacks = filtered;
}
const outroing = /* @__PURE__ */ new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
    // parent group
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor, customElement) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
      if (component.$$.on_destroy) {
        component.$$.on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
}
const AuthFlow_svelte_svelte_type_style_lang = "";
function create_if_block_3$3(ctx) {
  let div3;
  let h3;
  let t1;
  let p;
  let t3;
  let div1;
  let div0;
  let t4_value = (
    /*showToken*/
    (ctx[2] ? (
      /*token*/
      ctx[1]
    ) : (
      /*token*/
      ctx[1].replace(/./g, "•")
    )) + ""
  );
  let t4;
  let t5;
  let button0;
  let t6_value = (
    /*showToken*/
    ctx[2] ? "Hide" : "Show"
  );
  let t6;
  let t7;
  let div2;
  let button1;
  let t9;
  let button2;
  let mounted;
  let dispose;
  return {
    c() {
      div3 = element("div");
      h3 = element("h3");
      h3.textContent = "Complete Authentication";
      t1 = space();
      p = element("p");
      p.textContent = "You're all set! Click the button below to complete the authentication process and save your token securely in Obsidian.";
      t3 = space();
      div1 = element("div");
      div0 = element("div");
      t4 = text(t4_value);
      t5 = space();
      button0 = element("button");
      t6 = text(t6_value);
      t7 = space();
      div2 = element("div");
      button1 = element("button");
      button1.textContent = "Back";
      t9 = space();
      button2 = element("button");
      button2.textContent = "Complete Authentication";
      attr(h3, "class", "svelte-7dlp1m");
      attr(div0, "class", "token-mask svelte-7dlp1m");
      attr(button0, "class", "toggle-button svelte-7dlp1m");
      attr(div1, "class", "token-preview svelte-7dlp1m");
      attr(button1, "class", "back-button svelte-7dlp1m");
      attr(button2, "class", "action-button svelte-7dlp1m");
      attr(div2, "class", "button-row svelte-7dlp1m");
      attr(div3, "class", "step-info svelte-7dlp1m");
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      append(div3, h3);
      append(div3, t1);
      append(div3, p);
      append(div3, t3);
      append(div3, div1);
      append(div1, div0);
      append(div0, t4);
      append(div1, t5);
      append(div1, button0);
      append(button0, t6);
      append(div3, t7);
      append(div3, div2);
      append(div2, button1);
      append(div2, t9);
      append(div2, button2);
      if (!mounted) {
        dispose = [
          listen(
            button0,
            "click",
            /*click_handler_3*/
            ctx[10]
          ),
          listen(
            button1,
            "click",
            /*click_handler_4*/
            ctx[11]
          ),
          listen(
            button2,
            "click",
            /*submitToken*/
            ctx[4]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*showToken, token*/
      6 && t4_value !== (t4_value = /*showToken*/
      (ctx2[2] ? (
        /*token*/
        ctx2[1]
      ) : (
        /*token*/
        ctx2[1].replace(/./g, "•")
      )) + ""))
        set_data(t4, t4_value);
      if (dirty & /*showToken*/
      4 && t6_value !== (t6_value = /*showToken*/
      ctx2[2] ? "Hide" : "Show"))
        set_data(t6, t6_value);
    },
    d(detaching) {
      if (detaching)
        detach(div3);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_1$3(ctx) {
  let div2;
  let h3;
  let t1;
  let p;
  let t5;
  let div0;
  let t6;
  let button0;
  let t7_value = (
    /*showToken*/
    ctx[2] ? "Hide" : "Show"
  );
  let t7;
  let t8;
  let div1;
  let button1;
  let t10;
  let button2;
  let t11;
  let button2_disabled_value;
  let mounted;
  let dispose;
  function select_block_type_1(ctx2, dirty) {
    if (
      /*showToken*/
      ctx2[2]
    )
      return create_if_block_2$3;
    return create_else_block$2;
  }
  let current_block_type = select_block_type_1(ctx);
  let if_block = current_block_type(ctx);
  return {
    c() {
      div2 = element("div");
      h3 = element("h3");
      h3.textContent = "Copy Your New Access Token";
      t1 = space();
      p = element("p");
      p.innerHTML = `Once you&#39;ve generated your token in Netlify, copy it to your clipboard and paste it below.
          <strong>Important:</strong> Netlify will only show the token once, so make sure to copy it before closing the page!`;
      t5 = space();
      div0 = element("div");
      if_block.c();
      t6 = space();
      button0 = element("button");
      t7 = text(t7_value);
      t8 = space();
      div1 = element("div");
      button1 = element("button");
      button1.textContent = "Back";
      t10 = space();
      button2 = element("button");
      t11 = text("Continue");
      attr(h3, "class", "svelte-7dlp1m");
      attr(button0, "class", "toggle-button svelte-7dlp1m");
      attr(div0, "class", "token-input svelte-7dlp1m");
      attr(button1, "class", "back-button svelte-7dlp1m");
      attr(button2, "class", "action-button svelte-7dlp1m");
      button2.disabled = button2_disabled_value = !/*token*/
      ctx[1];
      attr(div1, "class", "button-row svelte-7dlp1m");
      attr(div2, "class", "step-info svelte-7dlp1m");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, h3);
      append(div2, t1);
      append(div2, p);
      append(div2, t5);
      append(div2, div0);
      if_block.m(div0, null);
      append(div0, t6);
      append(div0, button0);
      append(button0, t7);
      append(div2, t8);
      append(div2, div1);
      append(div1, button1);
      append(div1, t10);
      append(div1, button2);
      append(button2, t11);
      if (!mounted) {
        dispose = [
          listen(
            button0,
            "click",
            /*click_handler*/
            ctx[7]
          ),
          listen(
            button1,
            "click",
            /*click_handler_1*/
            ctx[8]
          ),
          listen(
            button2,
            "click",
            /*click_handler_2*/
            ctx[9]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type_1(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(div0, t6);
        }
      }
      if (dirty & /*showToken*/
      4 && t7_value !== (t7_value = /*showToken*/
      ctx2[2] ? "Hide" : "Show"))
        set_data(t7, t7_value);
      if (dirty & /*token*/
      2 && button2_disabled_value !== (button2_disabled_value = !/*token*/
      ctx2[1])) {
        button2.disabled = button2_disabled_value;
      }
    },
    d(detaching) {
      if (detaching)
        detach(div2);
      if_block.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block$3(ctx) {
  let div;
  let h3;
  let t1;
  let p;
  let t3;
  let ol;
  let t15;
  let button;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      h3 = element("h3");
      h3.textContent = "Generate a Netlify Personal Access Token";
      t1 = space();
      p = element("p");
      p.textContent = "To deploy your slides to Netlify, you need to generate a personal access token.\n          This will allow the plugin to securely deploy on your behalf.";
      t3 = space();
      ol = element("ol");
      ol.innerHTML = `<li class="svelte-7dlp1m">Click the button below to open the Netlify access tokens page</li> 
          <li class="svelte-7dlp1m">Log in to your Netlify account if prompted</li> 
          <li class="svelte-7dlp1m">Click &quot;New access token&quot;</li> 
          <li class="svelte-7dlp1m">Give it a description (e.g., &quot;Obsidian Advanced Slides Deploy&quot;)</li> 
          <li class="svelte-7dlp1m">Select the scope: &quot;sites:read&quot;, &quot;sites:write&quot;, &quot;deployments:write&quot;</li> 
          <li class="svelte-7dlp1m">Click &quot;Generate token&quot;</li>`;
      t15 = space();
      button = element("button");
      button.textContent = "Open Netlify Token Page";
      attr(h3, "class", "svelte-7dlp1m");
      attr(ol, "class", "instructions svelte-7dlp1m");
      attr(button, "class", "action-button svelte-7dlp1m");
      attr(div, "class", "step-info svelte-7dlp1m");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, h3);
      append(div, t1);
      append(div, p);
      append(div, t3);
      append(div, ol);
      append(div, t15);
      append(div, button);
      if (!mounted) {
        dispose = listen(
          button,
          "click",
          /*generateToken*/
          ctx[3]
        );
        mounted = true;
      }
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      mounted = false;
      dispose();
    }
  };
}
function create_else_block$2(ctx) {
  let input;
  let mounted;
  let dispose;
  return {
    c() {
      input = element("input");
      attr(input, "type", "password");
      attr(input, "placeholder", "Paste your Netlify token here");
      attr(input, "class", "svelte-7dlp1m");
    },
    m(target, anchor) {
      insert(target, input, anchor);
      set_input_value(
        input,
        /*token*/
        ctx[1]
      );
      if (!mounted) {
        dispose = listen(
          input,
          "input",
          /*input_input_handler_1*/
          ctx[6]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*token*/
      2 && input.value !== /*token*/
      ctx2[1]) {
        set_input_value(
          input,
          /*token*/
          ctx2[1]
        );
      }
    },
    d(detaching) {
      if (detaching)
        detach(input);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_2$3(ctx) {
  let input;
  let mounted;
  let dispose;
  return {
    c() {
      input = element("input");
      attr(input, "type", "text");
      attr(input, "placeholder", "Paste your Netlify token here");
      attr(input, "class", "svelte-7dlp1m");
    },
    m(target, anchor) {
      insert(target, input, anchor);
      set_input_value(
        input,
        /*token*/
        ctx[1]
      );
      if (!mounted) {
        dispose = listen(
          input,
          "input",
          /*input_input_handler*/
          ctx[5]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*token*/
      2 && input.value !== /*token*/
      ctx2[1]) {
        set_input_value(
          input,
          /*token*/
          ctx2[1]
        );
      }
    },
    d(detaching) {
      if (detaching)
        detach(input);
      mounted = false;
      dispose();
    }
  };
}
function create_fragment$3(ctx) {
  let div14;
  let div12;
  let div11;
  let div2;
  let div0;
  let t1;
  let div1;
  let div2_class_value;
  let t3;
  let div3;
  let t4;
  let div6;
  let div4;
  let t6;
  let div5;
  let div6_class_value;
  let t8;
  let div7;
  let t9;
  let div10;
  let div8;
  let t11;
  let div9;
  let div10_class_value;
  let t13;
  let div13;
  function select_block_type(ctx2, dirty) {
    if (
      /*currentStep*/
      ctx2[0] === 1
    )
      return create_if_block$3;
    if (
      /*currentStep*/
      ctx2[0] === 2
    )
      return create_if_block_1$3;
    if (
      /*currentStep*/
      ctx2[0] === 3
    )
      return create_if_block_3$3;
  }
  let current_block_type = select_block_type(ctx);
  let if_block = current_block_type && current_block_type(ctx);
  return {
    c() {
      div14 = element("div");
      div12 = element("div");
      div11 = element("div");
      div2 = element("div");
      div0 = element("div");
      div0.textContent = "1";
      t1 = space();
      div1 = element("div");
      div1.textContent = "Generate Token";
      t3 = space();
      div3 = element("div");
      t4 = space();
      div6 = element("div");
      div4 = element("div");
      div4.textContent = "2";
      t6 = space();
      div5 = element("div");
      div5.textContent = "Copy Token";
      t8 = space();
      div7 = element("div");
      t9 = space();
      div10 = element("div");
      div8 = element("div");
      div8.textContent = "3";
      t11 = space();
      div9 = element("div");
      div9.textContent = "Authenticate";
      t13 = space();
      div13 = element("div");
      if (if_block)
        if_block.c();
      attr(div0, "class", "step-number svelte-7dlp1m");
      attr(div1, "class", "step-label");
      attr(div2, "class", div2_class_value = "step-indicator " + /*currentStep*/
      (ctx[0] >= 1 ? "active" : "") + " svelte-7dlp1m");
      attr(div3, "class", "step-connector svelte-7dlp1m");
      attr(div4, "class", "step-number svelte-7dlp1m");
      attr(div5, "class", "step-label");
      attr(div6, "class", div6_class_value = "step-indicator " + /*currentStep*/
      (ctx[0] >= 2 ? "active" : "") + " svelte-7dlp1m");
      attr(div7, "class", "step-connector svelte-7dlp1m");
      attr(div8, "class", "step-number svelte-7dlp1m");
      attr(div9, "class", "step-label");
      attr(div10, "class", div10_class_value = "step-indicator " + /*currentStep*/
      (ctx[0] >= 3 ? "active" : "") + " svelte-7dlp1m");
      attr(div11, "class", "step-indicators svelte-7dlp1m");
      attr(div12, "class", "step-container svelte-7dlp1m");
      attr(div13, "class", "step-content svelte-7dlp1m");
      attr(div14, "class", "auth-flow svelte-7dlp1m");
    },
    m(target, anchor) {
      insert(target, div14, anchor);
      append(div14, div12);
      append(div12, div11);
      append(div11, div2);
      append(div2, div0);
      append(div2, t1);
      append(div2, div1);
      append(div11, t3);
      append(div11, div3);
      append(div11, t4);
      append(div11, div6);
      append(div6, div4);
      append(div6, t6);
      append(div6, div5);
      append(div11, t8);
      append(div11, div7);
      append(div11, t9);
      append(div11, div10);
      append(div10, div8);
      append(div10, t11);
      append(div10, div9);
      append(div14, t13);
      append(div14, div13);
      if (if_block)
        if_block.m(div13, null);
    },
    p(ctx2, [dirty]) {
      if (dirty & /*currentStep*/
      1 && div2_class_value !== (div2_class_value = "step-indicator " + /*currentStep*/
      (ctx2[0] >= 1 ? "active" : "") + " svelte-7dlp1m")) {
        attr(div2, "class", div2_class_value);
      }
      if (dirty & /*currentStep*/
      1 && div6_class_value !== (div6_class_value = "step-indicator " + /*currentStep*/
      (ctx2[0] >= 2 ? "active" : "") + " svelte-7dlp1m")) {
        attr(div6, "class", div6_class_value);
      }
      if (dirty & /*currentStep*/
      1 && div10_class_value !== (div10_class_value = "step-indicator " + /*currentStep*/
      (ctx2[0] >= 3 ? "active" : "") + " svelte-7dlp1m")) {
        attr(div10, "class", div10_class_value);
      }
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if (if_block)
          if_block.d(1);
        if_block = current_block_type && current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(div13, null);
        }
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div14);
      if (if_block) {
        if_block.d();
      }
    }
  };
}
function instance$3($$self, $$props, $$invalidate) {
  const dispatch = createEventDispatcher();
  let currentStep = 1;
  let token = "";
  let showToken = false;
  function generateToken() {
    window.open("https://app.netlify.com/user/applications#personal-access-tokens", "_blank");
    $$invalidate(0, currentStep = 2);
  }
  function submitToken() {
    if (token) {
      dispatch("tokenGenerated", { token });
    }
  }
  function input_input_handler() {
    token = this.value;
    $$invalidate(1, token);
  }
  function input_input_handler_1() {
    token = this.value;
    $$invalidate(1, token);
  }
  const click_handler = () => $$invalidate(2, showToken = !showToken);
  const click_handler_1 = () => $$invalidate(0, currentStep = 1);
  const click_handler_2 = () => {
    if (token)
      $$invalidate(0, currentStep = 3);
  };
  const click_handler_3 = () => $$invalidate(2, showToken = !showToken);
  const click_handler_4 = () => $$invalidate(0, currentStep = 2);
  return [
    currentStep,
    token,
    showToken,
    generateToken,
    submitToken,
    input_input_handler,
    input_input_handler_1,
    click_handler,
    click_handler_1,
    click_handler_2,
    click_handler_3,
    click_handler_4
  ];
}
class AuthFlow extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$3, create_fragment$3, safe_not_equal, {});
  }
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var jszip_min = { exports: {} };
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/
(function(module2, exports2) {
  !function(e) {
    module2.exports = e();
  }(function() {
    return function s(a, o, h) {
      function u(r, e2) {
        if (!o[r]) {
          if (!a[r]) {
            var t = "function" == typeof commonjsRequire && commonjsRequire;
            if (!e2 && t)
              return t(r, true);
            if (l)
              return l(r, true);
            var n = new Error("Cannot find module '" + r + "'");
            throw n.code = "MODULE_NOT_FOUND", n;
          }
          var i = o[r] = { exports: {} };
          a[r][0].call(i.exports, function(e3) {
            var t2 = a[r][1][e3];
            return u(t2 || e3);
          }, i, i.exports, s, a, o, h);
        }
        return o[r].exports;
      }
      for (var l = "function" == typeof commonjsRequire && commonjsRequire, e = 0; e < h.length; e++)
        u(h[e]);
      return u;
    }({ 1: [function(e, t, r) {
      var d = e("./utils"), c = e("./support"), p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      r.encode = function(e2) {
        for (var t2, r2, n, i, s, a, o, h = [], u = 0, l = e2.length, f = l, c2 = "string" !== d.getTypeOf(e2); u < e2.length; )
          f = l - u, n = c2 ? (t2 = e2[u++], r2 = u < l ? e2[u++] : 0, u < l ? e2[u++] : 0) : (t2 = e2.charCodeAt(u++), r2 = u < l ? e2.charCodeAt(u++) : 0, u < l ? e2.charCodeAt(u++) : 0), i = t2 >> 2, s = (3 & t2) << 4 | r2 >> 4, a = 1 < f ? (15 & r2) << 2 | n >> 6 : 64, o = 2 < f ? 63 & n : 64, h.push(p.charAt(i) + p.charAt(s) + p.charAt(a) + p.charAt(o));
        return h.join("");
      }, r.decode = function(e2) {
        var t2, r2, n, i, s, a, o = 0, h = 0, u = "data:";
        if (e2.substr(0, u.length) === u)
          throw new Error("Invalid base64 input, it looks like a data url.");
        var l, f = 3 * (e2 = e2.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
        if (e2.charAt(e2.length - 1) === p.charAt(64) && f--, e2.charAt(e2.length - 2) === p.charAt(64) && f--, f % 1 != 0)
          throw new Error("Invalid base64 input, bad content length.");
        for (l = c.uint8array ? new Uint8Array(0 | f) : new Array(0 | f); o < e2.length; )
          t2 = p.indexOf(e2.charAt(o++)) << 2 | (i = p.indexOf(e2.charAt(o++))) >> 4, r2 = (15 & i) << 4 | (s = p.indexOf(e2.charAt(o++))) >> 2, n = (3 & s) << 6 | (a = p.indexOf(e2.charAt(o++))), l[h++] = t2, 64 !== s && (l[h++] = r2), 64 !== a && (l[h++] = n);
        return l;
      };
    }, { "./support": 30, "./utils": 32 }], 2: [function(e, t, r) {
      var n = e("./external"), i = e("./stream/DataWorker"), s = e("./stream/Crc32Probe"), a = e("./stream/DataLengthProbe");
      function o(e2, t2, r2, n2, i2) {
        this.compressedSize = e2, this.uncompressedSize = t2, this.crc32 = r2, this.compression = n2, this.compressedContent = i2;
      }
      o.prototype = { getContentWorker: function() {
        var e2 = new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")), t2 = this;
        return e2.on("end", function() {
          if (this.streamInfo.data_length !== t2.uncompressedSize)
            throw new Error("Bug : uncompressed data size mismatch");
        }), e2;
      }, getCompressedWorker: function() {
        return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
      } }, o.createWorkerFrom = function(e2, t2, r2) {
        return e2.pipe(new s()).pipe(new a("uncompressedSize")).pipe(t2.compressWorker(r2)).pipe(new a("compressedSize")).withStreamInfo("compression", t2);
      }, t.exports = o;
    }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, t, r) {
      var n = e("./stream/GenericWorker");
      r.STORE = { magic: "\0\0", compressWorker: function() {
        return new n("STORE compression");
      }, uncompressWorker: function() {
        return new n("STORE decompression");
      } }, r.DEFLATE = e("./flate");
    }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, t, r) {
      var n = e("./utils");
      var o = function() {
        for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
          e2 = r2;
          for (var n2 = 0; n2 < 8; n2++)
            e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
          t2[r2] = e2;
        }
        return t2;
      }();
      t.exports = function(e2, t2) {
        return void 0 !== e2 && e2.length ? "string" !== n.getTypeOf(e2) ? function(e3, t3, r2, n2) {
          var i = o, s = n2 + r2;
          e3 ^= -1;
          for (var a = n2; a < s; a++)
            e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3[a])];
          return -1 ^ e3;
        }(0 | t2, e2, e2.length, 0) : function(e3, t3, r2, n2) {
          var i = o, s = n2 + r2;
          e3 ^= -1;
          for (var a = n2; a < s; a++)
            e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3.charCodeAt(a))];
          return -1 ^ e3;
        }(0 | t2, e2, e2.length, 0) : 0;
      };
    }, { "./utils": 32 }], 5: [function(e, t, r) {
      r.base64 = false, r.binary = false, r.dir = false, r.createFolders = true, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null;
    }, {}], 6: [function(e, t, r) {
      var n = null;
      n = "undefined" != typeof Promise ? Promise : e("lie"), t.exports = { Promise: n };
    }, { lie: 37 }], 7: [function(e, t, r) {
      var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array, i = e("pako"), s = e("./utils"), a = e("./stream/GenericWorker"), o = n ? "uint8array" : "array";
      function h(e2, t2) {
        a.call(this, "FlateWorker/" + e2), this._pako = null, this._pakoAction = e2, this._pakoOptions = t2, this.meta = {};
      }
      r.magic = "\b\0", s.inherits(h, a), h.prototype.processChunk = function(e2) {
        this.meta = e2.meta, null === this._pako && this._createPako(), this._pako.push(s.transformTo(o, e2.data), false);
      }, h.prototype.flush = function() {
        a.prototype.flush.call(this), null === this._pako && this._createPako(), this._pako.push([], true);
      }, h.prototype.cleanUp = function() {
        a.prototype.cleanUp.call(this), this._pako = null;
      }, h.prototype._createPako = function() {
        this._pako = new i[this._pakoAction]({ raw: true, level: this._pakoOptions.level || -1 });
        var t2 = this;
        this._pako.onData = function(e2) {
          t2.push({ data: e2, meta: t2.meta });
        };
      }, r.compressWorker = function(e2) {
        return new h("Deflate", e2);
      }, r.uncompressWorker = function() {
        return new h("Inflate", {});
      };
    }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, t, r) {
      function A(e2, t2) {
        var r2, n2 = "";
        for (r2 = 0; r2 < t2; r2++)
          n2 += String.fromCharCode(255 & e2), e2 >>>= 8;
        return n2;
      }
      function n(e2, t2, r2, n2, i2, s2) {
        var a, o, h = e2.file, u = e2.compression, l = s2 !== O.utf8encode, f = I.transformTo("string", s2(h.name)), c = I.transformTo("string", O.utf8encode(h.name)), d = h.comment, p = I.transformTo("string", s2(d)), m = I.transformTo("string", O.utf8encode(d)), _ = c.length !== h.name.length, g = m.length !== d.length, b = "", v = "", y = "", w = h.dir, k = h.date, x = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
        t2 && !r2 || (x.crc32 = e2.crc32, x.compressedSize = e2.compressedSize, x.uncompressedSize = e2.uncompressedSize);
        var S = 0;
        t2 && (S |= 8), l || !_ && !g || (S |= 2048);
        var z = 0, C = 0;
        w && (z |= 16), "UNIX" === i2 ? (C = 798, z |= function(e3, t3) {
          var r3 = e3;
          return e3 || (r3 = t3 ? 16893 : 33204), (65535 & r3) << 16;
        }(h.unixPermissions, w)) : (C = 20, z |= function(e3) {
          return 63 & (e3 || 0);
        }(h.dosPermissions)), a = k.getUTCHours(), a <<= 6, a |= k.getUTCMinutes(), a <<= 5, a |= k.getUTCSeconds() / 2, o = k.getUTCFullYear() - 1980, o <<= 4, o |= k.getUTCMonth() + 1, o <<= 5, o |= k.getUTCDate(), _ && (v = A(1, 1) + A(B(f), 4) + c, b += "up" + A(v.length, 2) + v), g && (y = A(1, 1) + A(B(p), 4) + m, b += "uc" + A(y.length, 2) + y);
        var E = "";
        return E += "\n\0", E += A(S, 2), E += u.magic, E += A(a, 2), E += A(o, 2), E += A(x.crc32, 4), E += A(x.compressedSize, 4), E += A(x.uncompressedSize, 4), E += A(f.length, 2), E += A(b.length, 2), { fileRecord: R.LOCAL_FILE_HEADER + E + f + b, dirRecord: R.CENTRAL_FILE_HEADER + A(C, 2) + E + A(p.length, 2) + "\0\0\0\0" + A(z, 4) + A(n2, 4) + f + b + p };
      }
      var I = e("../utils"), i = e("../stream/GenericWorker"), O = e("../utf8"), B = e("../crc32"), R = e("../signature");
      function s(e2, t2, r2, n2) {
        i.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = t2, this.zipPlatform = r2, this.encodeFileName = n2, this.streamFiles = e2, this.accumulate = false, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
      }
      I.inherits(s, i), s.prototype.push = function(e2) {
        var t2 = e2.meta.percent || 0, r2 = this.entriesCount, n2 = this._sources.length;
        this.accumulate ? this.contentBuffer.push(e2) : (this.bytesWritten += e2.data.length, i.prototype.push.call(this, { data: e2.data, meta: { currentFile: this.currentFile, percent: r2 ? (t2 + 100 * (r2 - n2 - 1)) / r2 : 100 } }));
      }, s.prototype.openedSource = function(e2) {
        this.currentSourceOffset = this.bytesWritten, this.currentFile = e2.file.name;
        var t2 = this.streamFiles && !e2.file.dir;
        if (t2) {
          var r2 = n(e2, t2, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          this.push({ data: r2.fileRecord, meta: { percent: 0 } });
        } else
          this.accumulate = true;
      }, s.prototype.closedSource = function(e2) {
        this.accumulate = false;
        var t2 = this.streamFiles && !e2.file.dir, r2 = n(e2, t2, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
        if (this.dirRecords.push(r2.dirRecord), t2)
          this.push({ data: function(e3) {
            return R.DATA_DESCRIPTOR + A(e3.crc32, 4) + A(e3.compressedSize, 4) + A(e3.uncompressedSize, 4);
          }(e2), meta: { percent: 100 } });
        else
          for (this.push({ data: r2.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; )
            this.push(this.contentBuffer.shift());
        this.currentFile = null;
      }, s.prototype.flush = function() {
        for (var e2 = this.bytesWritten, t2 = 0; t2 < this.dirRecords.length; t2++)
          this.push({ data: this.dirRecords[t2], meta: { percent: 100 } });
        var r2 = this.bytesWritten - e2, n2 = function(e3, t3, r3, n3, i2) {
          var s2 = I.transformTo("string", i2(n3));
          return R.CENTRAL_DIRECTORY_END + "\0\0\0\0" + A(e3, 2) + A(e3, 2) + A(t3, 4) + A(r3, 4) + A(s2.length, 2) + s2;
        }(this.dirRecords.length, r2, e2, this.zipComment, this.encodeFileName);
        this.push({ data: n2, meta: { percent: 100 } });
      }, s.prototype.prepareNextSource = function() {
        this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
      }, s.prototype.registerPrevious = function(e2) {
        this._sources.push(e2);
        var t2 = this;
        return e2.on("data", function(e3) {
          t2.processChunk(e3);
        }), e2.on("end", function() {
          t2.closedSource(t2.previous.streamInfo), t2._sources.length ? t2.prepareNextSource() : t2.end();
        }), e2.on("error", function(e3) {
          t2.error(e3);
        }), this;
      }, s.prototype.resume = function() {
        return !!i.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), true) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), true));
      }, s.prototype.error = function(e2) {
        var t2 = this._sources;
        if (!i.prototype.error.call(this, e2))
          return false;
        for (var r2 = 0; r2 < t2.length; r2++)
          try {
            t2[r2].error(e2);
          } catch (e3) {
          }
        return true;
      }, s.prototype.lock = function() {
        i.prototype.lock.call(this);
        for (var e2 = this._sources, t2 = 0; t2 < e2.length; t2++)
          e2[t2].lock();
      }, t.exports = s;
    }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, t, r) {
      var u = e("../compressions"), n = e("./ZipFileWorker");
      r.generateWorker = function(e2, a, t2) {
        var o = new n(a.streamFiles, t2, a.platform, a.encodeFileName), h = 0;
        try {
          e2.forEach(function(e3, t3) {
            h++;
            var r2 = function(e4, t4) {
              var r3 = e4 || t4, n3 = u[r3];
              if (!n3)
                throw new Error(r3 + " is not a valid compression method !");
              return n3;
            }(t3.options.compression, a.compression), n2 = t3.options.compressionOptions || a.compressionOptions || {}, i = t3.dir, s = t3.date;
            t3._compressWorker(r2, n2).withStreamInfo("file", { name: e3, dir: i, date: s, comment: t3.comment || "", unixPermissions: t3.unixPermissions, dosPermissions: t3.dosPermissions }).pipe(o);
          }), o.entriesCount = h;
        } catch (e3) {
          o.error(e3);
        }
        return o;
      };
    }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, t, r) {
      function n() {
        if (!(this instanceof n))
          return new n();
        if (arguments.length)
          throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
        this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
          var e2 = new n();
          for (var t2 in this)
            "function" != typeof this[t2] && (e2[t2] = this[t2]);
          return e2;
        };
      }
      (n.prototype = e("./object")).loadAsync = e("./load"), n.support = e("./support"), n.defaults = e("./defaults"), n.version = "3.10.1", n.loadAsync = function(e2, t2) {
        return new n().loadAsync(e2, t2);
      }, n.external = e("./external"), t.exports = n;
    }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, t, r) {
      var u = e("./utils"), i = e("./external"), n = e("./utf8"), s = e("./zipEntries"), a = e("./stream/Crc32Probe"), l = e("./nodejsUtils");
      function f(n2) {
        return new i.Promise(function(e2, t2) {
          var r2 = n2.decompressed.getContentWorker().pipe(new a());
          r2.on("error", function(e3) {
            t2(e3);
          }).on("end", function() {
            r2.streamInfo.crc32 !== n2.decompressed.crc32 ? t2(new Error("Corrupted zip : CRC32 mismatch")) : e2();
          }).resume();
        });
      }
      t.exports = function(e2, o) {
        var h = this;
        return o = u.extend(o || {}, { base64: false, checkCRC32: false, optimizedBinaryString: false, createFolders: false, decodeFileName: n.utf8decode }), l.isNode && l.isStream(e2) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : u.prepareContent("the loaded zip file", e2, true, o.optimizedBinaryString, o.base64).then(function(e3) {
          var t2 = new s(o);
          return t2.load(e3), t2;
        }).then(function(e3) {
          var t2 = [i.Promise.resolve(e3)], r2 = e3.files;
          if (o.checkCRC32)
            for (var n2 = 0; n2 < r2.length; n2++)
              t2.push(f(r2[n2]));
          return i.Promise.all(t2);
        }).then(function(e3) {
          for (var t2 = e3.shift(), r2 = t2.files, n2 = 0; n2 < r2.length; n2++) {
            var i2 = r2[n2], s2 = i2.fileNameStr, a2 = u.resolve(i2.fileNameStr);
            h.file(a2, i2.decompressed, { binary: true, optimizedBinaryString: true, date: i2.date, dir: i2.dir, comment: i2.fileCommentStr.length ? i2.fileCommentStr : null, unixPermissions: i2.unixPermissions, dosPermissions: i2.dosPermissions, createFolders: o.createFolders }), i2.dir || (h.file(a2).unsafeOriginalName = s2);
          }
          return t2.zipComment.length && (h.comment = t2.zipComment), h;
        });
      };
    }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, t, r) {
      var n = e("../utils"), i = e("../stream/GenericWorker");
      function s(e2, t2) {
        i.call(this, "Nodejs stream input adapter for " + e2), this._upstreamEnded = false, this._bindStream(t2);
      }
      n.inherits(s, i), s.prototype._bindStream = function(e2) {
        var t2 = this;
        (this._stream = e2).pause(), e2.on("data", function(e3) {
          t2.push({ data: e3, meta: { percent: 0 } });
        }).on("error", function(e3) {
          t2.isPaused ? this.generatedError = e3 : t2.error(e3);
        }).on("end", function() {
          t2.isPaused ? t2._upstreamEnded = true : t2.end();
        });
      }, s.prototype.pause = function() {
        return !!i.prototype.pause.call(this) && (this._stream.pause(), true);
      }, s.prototype.resume = function() {
        return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), true);
      }, t.exports = s;
    }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, t, r) {
      var i = e("readable-stream").Readable;
      function n(e2, t2, r2) {
        i.call(this, t2), this._helper = e2;
        var n2 = this;
        e2.on("data", function(e3, t3) {
          n2.push(e3) || n2._helper.pause(), r2 && r2(t3);
        }).on("error", function(e3) {
          n2.emit("error", e3);
        }).on("end", function() {
          n2.push(null);
        });
      }
      e("../utils").inherits(n, i), n.prototype._read = function() {
        this._helper.resume();
      }, t.exports = n;
    }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, t, r) {
      t.exports = { isNode: "undefined" != typeof Buffer, newBufferFrom: function(e2, t2) {
        if (Buffer.from && Buffer.from !== Uint8Array.from)
          return Buffer.from(e2, t2);
        if ("number" == typeof e2)
          throw new Error('The "data" argument must not be a number');
        return new Buffer(e2, t2);
      }, allocBuffer: function(e2) {
        if (Buffer.alloc)
          return Buffer.alloc(e2);
        var t2 = new Buffer(e2);
        return t2.fill(0), t2;
      }, isBuffer: function(e2) {
        return Buffer.isBuffer(e2);
      }, isStream: function(e2) {
        return e2 && "function" == typeof e2.on && "function" == typeof e2.pause && "function" == typeof e2.resume;
      } };
    }, {}], 15: [function(e, t, r) {
      function s(e2, t2, r2) {
        var n2, i2 = u.getTypeOf(t2), s2 = u.extend(r2 || {}, f);
        s2.date = s2.date || /* @__PURE__ */ new Date(), null !== s2.compression && (s2.compression = s2.compression.toUpperCase()), "string" == typeof s2.unixPermissions && (s2.unixPermissions = parseInt(s2.unixPermissions, 8)), s2.unixPermissions && 16384 & s2.unixPermissions && (s2.dir = true), s2.dosPermissions && 16 & s2.dosPermissions && (s2.dir = true), s2.dir && (e2 = g(e2)), s2.createFolders && (n2 = _(e2)) && b.call(this, n2, true);
        var a2 = "string" === i2 && false === s2.binary && false === s2.base64;
        r2 && void 0 !== r2.binary || (s2.binary = !a2), (t2 instanceof c && 0 === t2.uncompressedSize || s2.dir || !t2 || 0 === t2.length) && (s2.base64 = false, s2.binary = true, t2 = "", s2.compression = "STORE", i2 = "string");
        var o2 = null;
        o2 = t2 instanceof c || t2 instanceof l ? t2 : p.isNode && p.isStream(t2) ? new m(e2, t2) : u.prepareContent(e2, t2, s2.binary, s2.optimizedBinaryString, s2.base64);
        var h2 = new d(e2, o2, s2);
        this.files[e2] = h2;
      }
      var i = e("./utf8"), u = e("./utils"), l = e("./stream/GenericWorker"), a = e("./stream/StreamHelper"), f = e("./defaults"), c = e("./compressedObject"), d = e("./zipObject"), o = e("./generate"), p = e("./nodejsUtils"), m = e("./nodejs/NodejsStreamInputAdapter"), _ = function(e2) {
        "/" === e2.slice(-1) && (e2 = e2.substring(0, e2.length - 1));
        var t2 = e2.lastIndexOf("/");
        return 0 < t2 ? e2.substring(0, t2) : "";
      }, g = function(e2) {
        return "/" !== e2.slice(-1) && (e2 += "/"), e2;
      }, b = function(e2, t2) {
        return t2 = void 0 !== t2 ? t2 : f.createFolders, e2 = g(e2), this.files[e2] || s.call(this, e2, null, { dir: true, createFolders: t2 }), this.files[e2];
      };
      function h(e2) {
        return "[object RegExp]" === Object.prototype.toString.call(e2);
      }
      var n = { load: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, forEach: function(e2) {
        var t2, r2, n2;
        for (t2 in this.files)
          n2 = this.files[t2], (r2 = t2.slice(this.root.length, t2.length)) && t2.slice(0, this.root.length) === this.root && e2(r2, n2);
      }, filter: function(r2) {
        var n2 = [];
        return this.forEach(function(e2, t2) {
          r2(e2, t2) && n2.push(t2);
        }), n2;
      }, file: function(e2, t2, r2) {
        if (1 !== arguments.length)
          return e2 = this.root + e2, s.call(this, e2, t2, r2), this;
        if (h(e2)) {
          var n2 = e2;
          return this.filter(function(e3, t3) {
            return !t3.dir && n2.test(e3);
          });
        }
        var i2 = this.files[this.root + e2];
        return i2 && !i2.dir ? i2 : null;
      }, folder: function(r2) {
        if (!r2)
          return this;
        if (h(r2))
          return this.filter(function(e3, t3) {
            return t3.dir && r2.test(e3);
          });
        var e2 = this.root + r2, t2 = b.call(this, e2), n2 = this.clone();
        return n2.root = t2.name, n2;
      }, remove: function(r2) {
        r2 = this.root + r2;
        var e2 = this.files[r2];
        if (e2 || ("/" !== r2.slice(-1) && (r2 += "/"), e2 = this.files[r2]), e2 && !e2.dir)
          delete this.files[r2];
        else
          for (var t2 = this.filter(function(e3, t3) {
            return t3.name.slice(0, r2.length) === r2;
          }), n2 = 0; n2 < t2.length; n2++)
            delete this.files[t2[n2].name];
        return this;
      }, generate: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, generateInternalStream: function(e2) {
        var t2, r2 = {};
        try {
          if ((r2 = u.extend(e2 || {}, { streamFiles: false, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: i.utf8encode })).type = r2.type.toLowerCase(), r2.compression = r2.compression.toUpperCase(), "binarystring" === r2.type && (r2.type = "string"), !r2.type)
            throw new Error("No output type specified.");
          u.checkSupport(r2.type), "darwin" !== r2.platform && "freebsd" !== r2.platform && "linux" !== r2.platform && "sunos" !== r2.platform || (r2.platform = "UNIX"), "win32" === r2.platform && (r2.platform = "DOS");
          var n2 = r2.comment || this.comment || "";
          t2 = o.generateWorker(this, r2, n2);
        } catch (e3) {
          (t2 = new l("error")).error(e3);
        }
        return new a(t2, r2.type || "string", r2.mimeType);
      }, generateAsync: function(e2, t2) {
        return this.generateInternalStream(e2).accumulate(t2);
      }, generateNodeStream: function(e2, t2) {
        return (e2 = e2 || {}).type || (e2.type = "nodebuffer"), this.generateInternalStream(e2).toNodejsStream(t2);
      } };
      t.exports = n;
    }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, t, r) {
      t.exports = e("stream");
    }, { stream: void 0 }], 17: [function(e, t, r) {
      var n = e("./DataReader");
      function i(e2) {
        n.call(this, e2);
        for (var t2 = 0; t2 < this.data.length; t2++)
          e2[t2] = 255 & e2[t2];
      }
      e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
        return this.data[this.zero + e2];
      }, i.prototype.lastIndexOfSignature = function(e2) {
        for (var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.length - 4; 0 <= s; --s)
          if (this.data[s] === t2 && this.data[s + 1] === r2 && this.data[s + 2] === n2 && this.data[s + 3] === i2)
            return s - this.zero;
        return -1;
      }, i.prototype.readAndCheckSignature = function(e2) {
        var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.readData(4);
        return t2 === s[0] && r2 === s[1] && n2 === s[2] && i2 === s[3];
      }, i.prototype.readData = function(e2) {
        if (this.checkOffset(e2), 0 === e2)
          return [];
        var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
        return this.index += e2, t2;
      }, t.exports = i;
    }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, t, r) {
      var n = e("../utils");
      function i(e2) {
        this.data = e2, this.length = e2.length, this.index = 0, this.zero = 0;
      }
      i.prototype = { checkOffset: function(e2) {
        this.checkIndex(this.index + e2);
      }, checkIndex: function(e2) {
        if (this.length < this.zero + e2 || e2 < 0)
          throw new Error("End of data reached (data length = " + this.length + ", asked index = " + e2 + "). Corrupted zip ?");
      }, setIndex: function(e2) {
        this.checkIndex(e2), this.index = e2;
      }, skip: function(e2) {
        this.setIndex(this.index + e2);
      }, byteAt: function() {
      }, readInt: function(e2) {
        var t2, r2 = 0;
        for (this.checkOffset(e2), t2 = this.index + e2 - 1; t2 >= this.index; t2--)
          r2 = (r2 << 8) + this.byteAt(t2);
        return this.index += e2, r2;
      }, readString: function(e2) {
        return n.transformTo("string", this.readData(e2));
      }, readData: function() {
      }, lastIndexOfSignature: function() {
      }, readAndCheckSignature: function() {
      }, readDate: function() {
        var e2 = this.readInt(4);
        return new Date(Date.UTC(1980 + (e2 >> 25 & 127), (e2 >> 21 & 15) - 1, e2 >> 16 & 31, e2 >> 11 & 31, e2 >> 5 & 63, (31 & e2) << 1));
      } }, t.exports = i;
    }, { "../utils": 32 }], 19: [function(e, t, r) {
      var n = e("./Uint8ArrayReader");
      function i(e2) {
        n.call(this, e2);
      }
      e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
        this.checkOffset(e2);
        var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
        return this.index += e2, t2;
      }, t.exports = i;
    }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, t, r) {
      var n = e("./DataReader");
      function i(e2) {
        n.call(this, e2);
      }
      e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
        return this.data.charCodeAt(this.zero + e2);
      }, i.prototype.lastIndexOfSignature = function(e2) {
        return this.data.lastIndexOf(e2) - this.zero;
      }, i.prototype.readAndCheckSignature = function(e2) {
        return e2 === this.readData(4);
      }, i.prototype.readData = function(e2) {
        this.checkOffset(e2);
        var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
        return this.index += e2, t2;
      }, t.exports = i;
    }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, t, r) {
      var n = e("./ArrayReader");
      function i(e2) {
        n.call(this, e2);
      }
      e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
        if (this.checkOffset(e2), 0 === e2)
          return new Uint8Array(0);
        var t2 = this.data.subarray(this.zero + this.index, this.zero + this.index + e2);
        return this.index += e2, t2;
      }, t.exports = i;
    }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, t, r) {
      var n = e("../utils"), i = e("../support"), s = e("./ArrayReader"), a = e("./StringReader"), o = e("./NodeBufferReader"), h = e("./Uint8ArrayReader");
      t.exports = function(e2) {
        var t2 = n.getTypeOf(e2);
        return n.checkSupport(t2), "string" !== t2 || i.uint8array ? "nodebuffer" === t2 ? new o(e2) : i.uint8array ? new h(n.transformTo("uint8array", e2)) : new s(n.transformTo("array", e2)) : new a(e2);
      };
    }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, t, r) {
      r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\x07\b";
    }, {}], 24: [function(e, t, r) {
      var n = e("./GenericWorker"), i = e("../utils");
      function s(e2) {
        n.call(this, "ConvertWorker to " + e2), this.destType = e2;
      }
      i.inherits(s, n), s.prototype.processChunk = function(e2) {
        this.push({ data: i.transformTo(this.destType, e2.data), meta: e2.meta });
      }, t.exports = s;
    }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, t, r) {
      var n = e("./GenericWorker"), i = e("../crc32");
      function s() {
        n.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
      }
      e("../utils").inherits(s, n), s.prototype.processChunk = function(e2) {
        this.streamInfo.crc32 = i(e2.data, this.streamInfo.crc32 || 0), this.push(e2);
      }, t.exports = s;
    }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, t, r) {
      var n = e("../utils"), i = e("./GenericWorker");
      function s(e2) {
        i.call(this, "DataLengthProbe for " + e2), this.propName = e2, this.withStreamInfo(e2, 0);
      }
      n.inherits(s, i), s.prototype.processChunk = function(e2) {
        if (e2) {
          var t2 = this.streamInfo[this.propName] || 0;
          this.streamInfo[this.propName] = t2 + e2.data.length;
        }
        i.prototype.processChunk.call(this, e2);
      }, t.exports = s;
    }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, t, r) {
      var n = e("../utils"), i = e("./GenericWorker");
      function s(e2) {
        i.call(this, "DataWorker");
        var t2 = this;
        this.dataIsReady = false, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = false, e2.then(function(e3) {
          t2.dataIsReady = true, t2.data = e3, t2.max = e3 && e3.length || 0, t2.type = n.getTypeOf(e3), t2.isPaused || t2._tickAndRepeat();
        }, function(e3) {
          t2.error(e3);
        });
      }
      n.inherits(s, i), s.prototype.cleanUp = function() {
        i.prototype.cleanUp.call(this), this.data = null;
      }, s.prototype.resume = function() {
        return !!i.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = true, n.delay(this._tickAndRepeat, [], this)), true);
      }, s.prototype._tickAndRepeat = function() {
        this._tickScheduled = false, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n.delay(this._tickAndRepeat, [], this), this._tickScheduled = true));
      }, s.prototype._tick = function() {
        if (this.isPaused || this.isFinished)
          return false;
        var e2 = null, t2 = Math.min(this.max, this.index + 16384);
        if (this.index >= this.max)
          return this.end();
        switch (this.type) {
          case "string":
            e2 = this.data.substring(this.index, t2);
            break;
          case "uint8array":
            e2 = this.data.subarray(this.index, t2);
            break;
          case "array":
          case "nodebuffer":
            e2 = this.data.slice(this.index, t2);
        }
        return this.index = t2, this.push({ data: e2, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
      }, t.exports = s;
    }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, t, r) {
      function n(e2) {
        this.name = e2 || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = true, this.isFinished = false, this.isLocked = false, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
      }
      n.prototype = { push: function(e2) {
        this.emit("data", e2);
      }, end: function() {
        if (this.isFinished)
          return false;
        this.flush();
        try {
          this.emit("end"), this.cleanUp(), this.isFinished = true;
        } catch (e2) {
          this.emit("error", e2);
        }
        return true;
      }, error: function(e2) {
        return !this.isFinished && (this.isPaused ? this.generatedError = e2 : (this.isFinished = true, this.emit("error", e2), this.previous && this.previous.error(e2), this.cleanUp()), true);
      }, on: function(e2, t2) {
        return this._listeners[e2].push(t2), this;
      }, cleanUp: function() {
        this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
      }, emit: function(e2, t2) {
        if (this._listeners[e2])
          for (var r2 = 0; r2 < this._listeners[e2].length; r2++)
            this._listeners[e2][r2].call(this, t2);
      }, pipe: function(e2) {
        return e2.registerPrevious(this);
      }, registerPrevious: function(e2) {
        if (this.isLocked)
          throw new Error("The stream '" + this + "' has already been used.");
        this.streamInfo = e2.streamInfo, this.mergeStreamInfo(), this.previous = e2;
        var t2 = this;
        return e2.on("data", function(e3) {
          t2.processChunk(e3);
        }), e2.on("end", function() {
          t2.end();
        }), e2.on("error", function(e3) {
          t2.error(e3);
        }), this;
      }, pause: function() {
        return !this.isPaused && !this.isFinished && (this.isPaused = true, this.previous && this.previous.pause(), true);
      }, resume: function() {
        if (!this.isPaused || this.isFinished)
          return false;
        var e2 = this.isPaused = false;
        return this.generatedError && (this.error(this.generatedError), e2 = true), this.previous && this.previous.resume(), !e2;
      }, flush: function() {
      }, processChunk: function(e2) {
        this.push(e2);
      }, withStreamInfo: function(e2, t2) {
        return this.extraStreamInfo[e2] = t2, this.mergeStreamInfo(), this;
      }, mergeStreamInfo: function() {
        for (var e2 in this.extraStreamInfo)
          Object.prototype.hasOwnProperty.call(this.extraStreamInfo, e2) && (this.streamInfo[e2] = this.extraStreamInfo[e2]);
      }, lock: function() {
        if (this.isLocked)
          throw new Error("The stream '" + this + "' has already been used.");
        this.isLocked = true, this.previous && this.previous.lock();
      }, toString: function() {
        var e2 = "Worker " + this.name;
        return this.previous ? this.previous + " -> " + e2 : e2;
      } }, t.exports = n;
    }, {}], 29: [function(e, t, r) {
      var h = e("../utils"), i = e("./ConvertWorker"), s = e("./GenericWorker"), u = e("../base64"), n = e("../support"), a = e("../external"), o = null;
      if (n.nodestream)
        try {
          o = e("../nodejs/NodejsStreamOutputAdapter");
        } catch (e2) {
        }
      function l(e2, o2) {
        return new a.Promise(function(t2, r2) {
          var n2 = [], i2 = e2._internalType, s2 = e2._outputType, a2 = e2._mimeType;
          e2.on("data", function(e3, t3) {
            n2.push(e3), o2 && o2(t3);
          }).on("error", function(e3) {
            n2 = [], r2(e3);
          }).on("end", function() {
            try {
              var e3 = function(e4, t3, r3) {
                switch (e4) {
                  case "blob":
                    return h.newBlob(h.transformTo("arraybuffer", t3), r3);
                  case "base64":
                    return u.encode(t3);
                  default:
                    return h.transformTo(e4, t3);
                }
              }(s2, function(e4, t3) {
                var r3, n3 = 0, i3 = null, s3 = 0;
                for (r3 = 0; r3 < t3.length; r3++)
                  s3 += t3[r3].length;
                switch (e4) {
                  case "string":
                    return t3.join("");
                  case "array":
                    return Array.prototype.concat.apply([], t3);
                  case "uint8array":
                    for (i3 = new Uint8Array(s3), r3 = 0; r3 < t3.length; r3++)
                      i3.set(t3[r3], n3), n3 += t3[r3].length;
                    return i3;
                  case "nodebuffer":
                    return Buffer.concat(t3);
                  default:
                    throw new Error("concat : unsupported type '" + e4 + "'");
                }
              }(i2, n2), a2);
              t2(e3);
            } catch (e4) {
              r2(e4);
            }
            n2 = [];
          }).resume();
        });
      }
      function f(e2, t2, r2) {
        var n2 = t2;
        switch (t2) {
          case "blob":
          case "arraybuffer":
            n2 = "uint8array";
            break;
          case "base64":
            n2 = "string";
        }
        try {
          this._internalType = n2, this._outputType = t2, this._mimeType = r2, h.checkSupport(n2), this._worker = e2.pipe(new i(n2)), e2.lock();
        } catch (e3) {
          this._worker = new s("error"), this._worker.error(e3);
        }
      }
      f.prototype = { accumulate: function(e2) {
        return l(this, e2);
      }, on: function(e2, t2) {
        var r2 = this;
        return "data" === e2 ? this._worker.on(e2, function(e3) {
          t2.call(r2, e3.data, e3.meta);
        }) : this._worker.on(e2, function() {
          h.delay(t2, arguments, r2);
        }), this;
      }, resume: function() {
        return h.delay(this._worker.resume, [], this._worker), this;
      }, pause: function() {
        return this._worker.pause(), this;
      }, toNodejsStream: function(e2) {
        if (h.checkSupport("nodestream"), "nodebuffer" !== this._outputType)
          throw new Error(this._outputType + " is not supported by this method");
        return new o(this, { objectMode: "nodebuffer" !== this._outputType }, e2);
      } }, t.exports = f;
    }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, t, r) {
      if (r.base64 = true, r.array = true, r.string = true, r.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, r.nodebuffer = "undefined" != typeof Buffer, r.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer)
        r.blob = false;
      else {
        var n = new ArrayBuffer(0);
        try {
          r.blob = 0 === new Blob([n], { type: "application/zip" }).size;
        } catch (e2) {
          try {
            var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
            i.append(n), r.blob = 0 === i.getBlob("application/zip").size;
          } catch (e3) {
            r.blob = false;
          }
        }
      }
      try {
        r.nodestream = !!e("readable-stream").Readable;
      } catch (e2) {
        r.nodestream = false;
      }
    }, { "readable-stream": 16 }], 31: [function(e, t, s) {
      for (var o = e("./utils"), h = e("./support"), r = e("./nodejsUtils"), n = e("./stream/GenericWorker"), u = new Array(256), i = 0; i < 256; i++)
        u[i] = 252 <= i ? 6 : 248 <= i ? 5 : 240 <= i ? 4 : 224 <= i ? 3 : 192 <= i ? 2 : 1;
      u[254] = u[254] = 1;
      function a() {
        n.call(this, "utf-8 decode"), this.leftOver = null;
      }
      function l() {
        n.call(this, "utf-8 encode");
      }
      s.utf8encode = function(e2) {
        return h.nodebuffer ? r.newBufferFrom(e2, "utf-8") : function(e3) {
          var t2, r2, n2, i2, s2, a2 = e3.length, o2 = 0;
          for (i2 = 0; i2 < a2; i2++)
            55296 == (64512 & (r2 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o2 += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
          for (t2 = h.uint8array ? new Uint8Array(o2) : new Array(o2), i2 = s2 = 0; s2 < o2; i2++)
            55296 == (64512 & (r2 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
          return t2;
        }(e2);
      }, s.utf8decode = function(e2) {
        return h.nodebuffer ? o.transformTo("nodebuffer", e2).toString("utf-8") : function(e3) {
          var t2, r2, n2, i2, s2 = e3.length, a2 = new Array(2 * s2);
          for (t2 = r2 = 0; t2 < s2; )
            if ((n2 = e3[t2++]) < 128)
              a2[r2++] = n2;
            else if (4 < (i2 = u[n2]))
              a2[r2++] = 65533, t2 += i2 - 1;
            else {
              for (n2 &= 2 === i2 ? 31 : 3 === i2 ? 15 : 7; 1 < i2 && t2 < s2; )
                n2 = n2 << 6 | 63 & e3[t2++], i2--;
              1 < i2 ? a2[r2++] = 65533 : n2 < 65536 ? a2[r2++] = n2 : (n2 -= 65536, a2[r2++] = 55296 | n2 >> 10 & 1023, a2[r2++] = 56320 | 1023 & n2);
            }
          return a2.length !== r2 && (a2.subarray ? a2 = a2.subarray(0, r2) : a2.length = r2), o.applyFromCharCode(a2);
        }(e2 = o.transformTo(h.uint8array ? "uint8array" : "array", e2));
      }, o.inherits(a, n), a.prototype.processChunk = function(e2) {
        var t2 = o.transformTo(h.uint8array ? "uint8array" : "array", e2.data);
        if (this.leftOver && this.leftOver.length) {
          if (h.uint8array) {
            var r2 = t2;
            (t2 = new Uint8Array(r2.length + this.leftOver.length)).set(this.leftOver, 0), t2.set(r2, this.leftOver.length);
          } else
            t2 = this.leftOver.concat(t2);
          this.leftOver = null;
        }
        var n2 = function(e3, t3) {
          var r3;
          for ((t3 = t3 || e3.length) > e3.length && (t3 = e3.length), r3 = t3 - 1; 0 <= r3 && 128 == (192 & e3[r3]); )
            r3--;
          return r3 < 0 ? t3 : 0 === r3 ? t3 : r3 + u[e3[r3]] > t3 ? r3 : t3;
        }(t2), i2 = t2;
        n2 !== t2.length && (h.uint8array ? (i2 = t2.subarray(0, n2), this.leftOver = t2.subarray(n2, t2.length)) : (i2 = t2.slice(0, n2), this.leftOver = t2.slice(n2, t2.length))), this.push({ data: s.utf8decode(i2), meta: e2.meta });
      }, a.prototype.flush = function() {
        this.leftOver && this.leftOver.length && (this.push({ data: s.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
      }, s.Utf8DecodeWorker = a, o.inherits(l, n), l.prototype.processChunk = function(e2) {
        this.push({ data: s.utf8encode(e2.data), meta: e2.meta });
      }, s.Utf8EncodeWorker = l;
    }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, t, a) {
      var o = e("./support"), h = e("./base64"), r = e("./nodejsUtils"), u = e("./external");
      function n(e2) {
        return e2;
      }
      function l(e2, t2) {
        for (var r2 = 0; r2 < e2.length; ++r2)
          t2[r2] = 255 & e2.charCodeAt(r2);
        return t2;
      }
      e("setimmediate"), a.newBlob = function(t2, r2) {
        a.checkSupport("blob");
        try {
          return new Blob([t2], { type: r2 });
        } catch (e2) {
          try {
            var n2 = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
            return n2.append(t2), n2.getBlob(r2);
          } catch (e3) {
            throw new Error("Bug : can't construct the Blob.");
          }
        }
      };
      var i = { stringifyByChunk: function(e2, t2, r2) {
        var n2 = [], i2 = 0, s2 = e2.length;
        if (s2 <= r2)
          return String.fromCharCode.apply(null, e2);
        for (; i2 < s2; )
          "array" === t2 || "nodebuffer" === t2 ? n2.push(String.fromCharCode.apply(null, e2.slice(i2, Math.min(i2 + r2, s2)))) : n2.push(String.fromCharCode.apply(null, e2.subarray(i2, Math.min(i2 + r2, s2)))), i2 += r2;
        return n2.join("");
      }, stringifyByChar: function(e2) {
        for (var t2 = "", r2 = 0; r2 < e2.length; r2++)
          t2 += String.fromCharCode(e2[r2]);
        return t2;
      }, applyCanBeUsed: { uint8array: function() {
        try {
          return o.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length;
        } catch (e2) {
          return false;
        }
      }(), nodebuffer: function() {
        try {
          return o.nodebuffer && 1 === String.fromCharCode.apply(null, r.allocBuffer(1)).length;
        } catch (e2) {
          return false;
        }
      }() } };
      function s(e2) {
        var t2 = 65536, r2 = a.getTypeOf(e2), n2 = true;
        if ("uint8array" === r2 ? n2 = i.applyCanBeUsed.uint8array : "nodebuffer" === r2 && (n2 = i.applyCanBeUsed.nodebuffer), n2)
          for (; 1 < t2; )
            try {
              return i.stringifyByChunk(e2, r2, t2);
            } catch (e3) {
              t2 = Math.floor(t2 / 2);
            }
        return i.stringifyByChar(e2);
      }
      function f(e2, t2) {
        for (var r2 = 0; r2 < e2.length; r2++)
          t2[r2] = e2[r2];
        return t2;
      }
      a.applyFromCharCode = s;
      var c = {};
      c.string = { string: n, array: function(e2) {
        return l(e2, new Array(e2.length));
      }, arraybuffer: function(e2) {
        return c.string.uint8array(e2).buffer;
      }, uint8array: function(e2) {
        return l(e2, new Uint8Array(e2.length));
      }, nodebuffer: function(e2) {
        return l(e2, r.allocBuffer(e2.length));
      } }, c.array = { string: s, array: n, arraybuffer: function(e2) {
        return new Uint8Array(e2).buffer;
      }, uint8array: function(e2) {
        return new Uint8Array(e2);
      }, nodebuffer: function(e2) {
        return r.newBufferFrom(e2);
      } }, c.arraybuffer = { string: function(e2) {
        return s(new Uint8Array(e2));
      }, array: function(e2) {
        return f(new Uint8Array(e2), new Array(e2.byteLength));
      }, arraybuffer: n, uint8array: function(e2) {
        return new Uint8Array(e2);
      }, nodebuffer: function(e2) {
        return r.newBufferFrom(new Uint8Array(e2));
      } }, c.uint8array = { string: s, array: function(e2) {
        return f(e2, new Array(e2.length));
      }, arraybuffer: function(e2) {
        return e2.buffer;
      }, uint8array: n, nodebuffer: function(e2) {
        return r.newBufferFrom(e2);
      } }, c.nodebuffer = { string: s, array: function(e2) {
        return f(e2, new Array(e2.length));
      }, arraybuffer: function(e2) {
        return c.nodebuffer.uint8array(e2).buffer;
      }, uint8array: function(e2) {
        return f(e2, new Uint8Array(e2.length));
      }, nodebuffer: n }, a.transformTo = function(e2, t2) {
        if (t2 = t2 || "", !e2)
          return t2;
        a.checkSupport(e2);
        var r2 = a.getTypeOf(t2);
        return c[r2][e2](t2);
      }, a.resolve = function(e2) {
        for (var t2 = e2.split("/"), r2 = [], n2 = 0; n2 < t2.length; n2++) {
          var i2 = t2[n2];
          "." === i2 || "" === i2 && 0 !== n2 && n2 !== t2.length - 1 || (".." === i2 ? r2.pop() : r2.push(i2));
        }
        return r2.join("/");
      }, a.getTypeOf = function(e2) {
        return "string" == typeof e2 ? "string" : "[object Array]" === Object.prototype.toString.call(e2) ? "array" : o.nodebuffer && r.isBuffer(e2) ? "nodebuffer" : o.uint8array && e2 instanceof Uint8Array ? "uint8array" : o.arraybuffer && e2 instanceof ArrayBuffer ? "arraybuffer" : void 0;
      }, a.checkSupport = function(e2) {
        if (!o[e2.toLowerCase()])
          throw new Error(e2 + " is not supported by this platform");
      }, a.MAX_VALUE_16BITS = 65535, a.MAX_VALUE_32BITS = -1, a.pretty = function(e2) {
        var t2, r2, n2 = "";
        for (r2 = 0; r2 < (e2 || "").length; r2++)
          n2 += "\\x" + ((t2 = e2.charCodeAt(r2)) < 16 ? "0" : "") + t2.toString(16).toUpperCase();
        return n2;
      }, a.delay = function(e2, t2, r2) {
        setImmediate(function() {
          e2.apply(r2 || null, t2 || []);
        });
      }, a.inherits = function(e2, t2) {
        function r2() {
        }
        r2.prototype = t2.prototype, e2.prototype = new r2();
      }, a.extend = function() {
        var e2, t2, r2 = {};
        for (e2 = 0; e2 < arguments.length; e2++)
          for (t2 in arguments[e2])
            Object.prototype.hasOwnProperty.call(arguments[e2], t2) && void 0 === r2[t2] && (r2[t2] = arguments[e2][t2]);
        return r2;
      }, a.prepareContent = function(r2, e2, n2, i2, s2) {
        return u.Promise.resolve(e2).then(function(n3) {
          return o.blob && (n3 instanceof Blob || -1 !== ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(n3))) && "undefined" != typeof FileReader ? new u.Promise(function(t2, r3) {
            var e3 = new FileReader();
            e3.onload = function(e4) {
              t2(e4.target.result);
            }, e3.onerror = function(e4) {
              r3(e4.target.error);
            }, e3.readAsArrayBuffer(n3);
          }) : n3;
        }).then(function(e3) {
          var t2 = a.getTypeOf(e3);
          return t2 ? ("arraybuffer" === t2 ? e3 = a.transformTo("uint8array", e3) : "string" === t2 && (s2 ? e3 = h.decode(e3) : n2 && true !== i2 && (e3 = function(e4) {
            return l(e4, o.uint8array ? new Uint8Array(e4.length) : new Array(e4.length));
          }(e3))), e3) : u.Promise.reject(new Error("Can't read the data of '" + r2 + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
        });
      };
    }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, t, r) {
      var n = e("./reader/readerFor"), i = e("./utils"), s = e("./signature"), a = e("./zipEntry"), o = e("./support");
      function h(e2) {
        this.files = [], this.loadOptions = e2;
      }
      h.prototype = { checkSignature: function(e2) {
        if (!this.reader.readAndCheckSignature(e2)) {
          this.reader.index -= 4;
          var t2 = this.reader.readString(4);
          throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(t2) + ", expected " + i.pretty(e2) + ")");
        }
      }, isSignature: function(e2, t2) {
        var r2 = this.reader.index;
        this.reader.setIndex(e2);
        var n2 = this.reader.readString(4) === t2;
        return this.reader.setIndex(r2), n2;
      }, readBlockEndOfCentral: function() {
        this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
        var e2 = this.reader.readData(this.zipCommentLength), t2 = o.uint8array ? "uint8array" : "array", r2 = i.transformTo(t2, e2);
        this.zipComment = this.loadOptions.decodeFileName(r2);
      }, readBlockZip64EndOfCentral: function() {
        this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
        for (var e2, t2, r2, n2 = this.zip64EndOfCentralSize - 44; 0 < n2; )
          e2 = this.reader.readInt(2), t2 = this.reader.readInt(4), r2 = this.reader.readData(t2), this.zip64ExtensibleData[e2] = { id: e2, length: t2, value: r2 };
      }, readBlockZip64EndOfCentralLocator: function() {
        if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount)
          throw new Error("Multi-volumes zip are not supported");
      }, readLocalFiles: function() {
        var e2, t2;
        for (e2 = 0; e2 < this.files.length; e2++)
          t2 = this.files[e2], this.reader.setIndex(t2.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), t2.readLocalPart(this.reader), t2.handleUTF8(), t2.processAttributes();
      }, readCentralDir: function() {
        var e2;
        for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER); )
          (e2 = new a({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(e2);
        if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length)
          throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
      }, readEndOfCentral: function() {
        var e2 = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
        if (e2 < 0)
          throw !this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip: can't find end of central directory");
        this.reader.setIndex(e2);
        var t2 = e2;
        if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
          if (this.zip64 = true, (e2 = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0)
            throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
          if (this.reader.setIndex(e2), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0))
            throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
          this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
        }
        var r2 = this.centralDirOffset + this.centralDirSize;
        this.zip64 && (r2 += 20, r2 += 12 + this.zip64EndOfCentralSize);
        var n2 = t2 - r2;
        if (0 < n2)
          this.isSignature(t2, s.CENTRAL_FILE_HEADER) || (this.reader.zero = n2);
        else if (n2 < 0)
          throw new Error("Corrupted zip: missing " + Math.abs(n2) + " bytes.");
      }, prepareReader: function(e2) {
        this.reader = n(e2);
      }, load: function(e2) {
        this.prepareReader(e2), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
      } }, t.exports = h;
    }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, t, r) {
      var n = e("./reader/readerFor"), s = e("./utils"), i = e("./compressedObject"), a = e("./crc32"), o = e("./utf8"), h = e("./compressions"), u = e("./support");
      function l(e2, t2) {
        this.options = e2, this.loadOptions = t2;
      }
      l.prototype = { isEncrypted: function() {
        return 1 == (1 & this.bitFlag);
      }, useUTF8: function() {
        return 2048 == (2048 & this.bitFlag);
      }, readLocalPart: function(e2) {
        var t2, r2;
        if (e2.skip(22), this.fileNameLength = e2.readInt(2), r2 = e2.readInt(2), this.fileName = e2.readData(this.fileNameLength), e2.skip(r2), -1 === this.compressedSize || -1 === this.uncompressedSize)
          throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
        if (null === (t2 = function(e3) {
          for (var t3 in h)
            if (Object.prototype.hasOwnProperty.call(h, t3) && h[t3].magic === e3)
              return h[t3];
          return null;
        }(this.compressionMethod)))
          throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
        this.decompressed = new i(this.compressedSize, this.uncompressedSize, this.crc32, t2, e2.readData(this.compressedSize));
      }, readCentralPart: function(e2) {
        this.versionMadeBy = e2.readInt(2), e2.skip(2), this.bitFlag = e2.readInt(2), this.compressionMethod = e2.readString(2), this.date = e2.readDate(), this.crc32 = e2.readInt(4), this.compressedSize = e2.readInt(4), this.uncompressedSize = e2.readInt(4);
        var t2 = e2.readInt(2);
        if (this.extraFieldsLength = e2.readInt(2), this.fileCommentLength = e2.readInt(2), this.diskNumberStart = e2.readInt(2), this.internalFileAttributes = e2.readInt(2), this.externalFileAttributes = e2.readInt(4), this.localHeaderOffset = e2.readInt(4), this.isEncrypted())
          throw new Error("Encrypted zip are not supported");
        e2.skip(t2), this.readExtraFields(e2), this.parseZIP64ExtraField(e2), this.fileComment = e2.readData(this.fileCommentLength);
      }, processAttributes: function() {
        this.unixPermissions = null, this.dosPermissions = null;
        var e2 = this.versionMadeBy >> 8;
        this.dir = !!(16 & this.externalFileAttributes), 0 == e2 && (this.dosPermissions = 63 & this.externalFileAttributes), 3 == e2 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = true);
      }, parseZIP64ExtraField: function() {
        if (this.extraFields[1]) {
          var e2 = n(this.extraFields[1].value);
          this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = e2.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = e2.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = e2.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = e2.readInt(4));
        }
      }, readExtraFields: function(e2) {
        var t2, r2, n2, i2 = e2.index + this.extraFieldsLength;
        for (this.extraFields || (this.extraFields = {}); e2.index + 4 < i2; )
          t2 = e2.readInt(2), r2 = e2.readInt(2), n2 = e2.readData(r2), this.extraFields[t2] = { id: t2, length: r2, value: n2 };
        e2.setIndex(i2);
      }, handleUTF8: function() {
        var e2 = u.uint8array ? "uint8array" : "array";
        if (this.useUTF8())
          this.fileNameStr = o.utf8decode(this.fileName), this.fileCommentStr = o.utf8decode(this.fileComment);
        else {
          var t2 = this.findExtraFieldUnicodePath();
          if (null !== t2)
            this.fileNameStr = t2;
          else {
            var r2 = s.transformTo(e2, this.fileName);
            this.fileNameStr = this.loadOptions.decodeFileName(r2);
          }
          var n2 = this.findExtraFieldUnicodeComment();
          if (null !== n2)
            this.fileCommentStr = n2;
          else {
            var i2 = s.transformTo(e2, this.fileComment);
            this.fileCommentStr = this.loadOptions.decodeFileName(i2);
          }
        }
      }, findExtraFieldUnicodePath: function() {
        var e2 = this.extraFields[28789];
        if (e2) {
          var t2 = n(e2.value);
          return 1 !== t2.readInt(1) ? null : a(this.fileName) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
        }
        return null;
      }, findExtraFieldUnicodeComment: function() {
        var e2 = this.extraFields[25461];
        if (e2) {
          var t2 = n(e2.value);
          return 1 !== t2.readInt(1) ? null : a(this.fileComment) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
        }
        return null;
      } }, t.exports = l;
    }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, t, r) {
      function n(e2, t2, r2) {
        this.name = e2, this.dir = r2.dir, this.date = r2.date, this.comment = r2.comment, this.unixPermissions = r2.unixPermissions, this.dosPermissions = r2.dosPermissions, this._data = t2, this._dataBinary = r2.binary, this.options = { compression: r2.compression, compressionOptions: r2.compressionOptions };
      }
      var s = e("./stream/StreamHelper"), i = e("./stream/DataWorker"), a = e("./utf8"), o = e("./compressedObject"), h = e("./stream/GenericWorker");
      n.prototype = { internalStream: function(e2) {
        var t2 = null, r2 = "string";
        try {
          if (!e2)
            throw new Error("No output type specified.");
          var n2 = "string" === (r2 = e2.toLowerCase()) || "text" === r2;
          "binarystring" !== r2 && "text" !== r2 || (r2 = "string"), t2 = this._decompressWorker();
          var i2 = !this._dataBinary;
          i2 && !n2 && (t2 = t2.pipe(new a.Utf8EncodeWorker())), !i2 && n2 && (t2 = t2.pipe(new a.Utf8DecodeWorker()));
        } catch (e3) {
          (t2 = new h("error")).error(e3);
        }
        return new s(t2, r2, "");
      }, async: function(e2, t2) {
        return this.internalStream(e2).accumulate(t2);
      }, nodeStream: function(e2, t2) {
        return this.internalStream(e2 || "nodebuffer").toNodejsStream(t2);
      }, _compressWorker: function(e2, t2) {
        if (this._data instanceof o && this._data.compression.magic === e2.magic)
          return this._data.getCompressedWorker();
        var r2 = this._decompressWorker();
        return this._dataBinary || (r2 = r2.pipe(new a.Utf8EncodeWorker())), o.createWorkerFrom(r2, e2, t2);
      }, _decompressWorker: function() {
        return this._data instanceof o ? this._data.getContentWorker() : this._data instanceof h ? this._data : new i(this._data);
      } };
      for (var u = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], l = function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, f = 0; f < u.length; f++)
        n.prototype[u[f]] = l;
      t.exports = n;
    }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, l, t) {
      (function(t2) {
        var r, n, e2 = t2.MutationObserver || t2.WebKitMutationObserver;
        if (e2) {
          var i = 0, s = new e2(u), a = t2.document.createTextNode("");
          s.observe(a, { characterData: true }), r = function() {
            a.data = i = ++i % 2;
          };
        } else if (t2.setImmediate || void 0 === t2.MessageChannel)
          r = "document" in t2 && "onreadystatechange" in t2.document.createElement("script") ? function() {
            var e3 = t2.document.createElement("script");
            e3.onreadystatechange = function() {
              u(), e3.onreadystatechange = null, e3.parentNode.removeChild(e3), e3 = null;
            }, t2.document.documentElement.appendChild(e3);
          } : function() {
            setTimeout(u, 0);
          };
        else {
          var o = new t2.MessageChannel();
          o.port1.onmessage = u, r = function() {
            o.port2.postMessage(0);
          };
        }
        var h = [];
        function u() {
          var e3, t3;
          n = true;
          for (var r2 = h.length; r2; ) {
            for (t3 = h, h = [], e3 = -1; ++e3 < r2; )
              t3[e3]();
            r2 = h.length;
          }
          n = false;
        }
        l.exports = function(e3) {
          1 !== h.push(e3) || n || r();
        };
      }).call(this, "undefined" != typeof commonjsGlobal ? commonjsGlobal : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}], 37: [function(e, t, r) {
      var i = e("immediate");
      function u() {
      }
      var l = {}, s = ["REJECTED"], a = ["FULFILLED"], n = ["PENDING"];
      function o(e2) {
        if ("function" != typeof e2)
          throw new TypeError("resolver must be a function");
        this.state = n, this.queue = [], this.outcome = void 0, e2 !== u && d(this, e2);
      }
      function h(e2, t2, r2) {
        this.promise = e2, "function" == typeof t2 && (this.onFulfilled = t2, this.callFulfilled = this.otherCallFulfilled), "function" == typeof r2 && (this.onRejected = r2, this.callRejected = this.otherCallRejected);
      }
      function f(t2, r2, n2) {
        i(function() {
          var e2;
          try {
            e2 = r2(n2);
          } catch (e3) {
            return l.reject(t2, e3);
          }
          e2 === t2 ? l.reject(t2, new TypeError("Cannot resolve promise with itself")) : l.resolve(t2, e2);
        });
      }
      function c(e2) {
        var t2 = e2 && e2.then;
        if (e2 && ("object" == typeof e2 || "function" == typeof e2) && "function" == typeof t2)
          return function() {
            t2.apply(e2, arguments);
          };
      }
      function d(t2, e2) {
        var r2 = false;
        function n2(e3) {
          r2 || (r2 = true, l.reject(t2, e3));
        }
        function i2(e3) {
          r2 || (r2 = true, l.resolve(t2, e3));
        }
        var s2 = p(function() {
          e2(i2, n2);
        });
        "error" === s2.status && n2(s2.value);
      }
      function p(e2, t2) {
        var r2 = {};
        try {
          r2.value = e2(t2), r2.status = "success";
        } catch (e3) {
          r2.status = "error", r2.value = e3;
        }
        return r2;
      }
      (t.exports = o).prototype.finally = function(t2) {
        if ("function" != typeof t2)
          return this;
        var r2 = this.constructor;
        return this.then(function(e2) {
          return r2.resolve(t2()).then(function() {
            return e2;
          });
        }, function(e2) {
          return r2.resolve(t2()).then(function() {
            throw e2;
          });
        });
      }, o.prototype.catch = function(e2) {
        return this.then(null, e2);
      }, o.prototype.then = function(e2, t2) {
        if ("function" != typeof e2 && this.state === a || "function" != typeof t2 && this.state === s)
          return this;
        var r2 = new this.constructor(u);
        this.state !== n ? f(r2, this.state === a ? e2 : t2, this.outcome) : this.queue.push(new h(r2, e2, t2));
        return r2;
      }, h.prototype.callFulfilled = function(e2) {
        l.resolve(this.promise, e2);
      }, h.prototype.otherCallFulfilled = function(e2) {
        f(this.promise, this.onFulfilled, e2);
      }, h.prototype.callRejected = function(e2) {
        l.reject(this.promise, e2);
      }, h.prototype.otherCallRejected = function(e2) {
        f(this.promise, this.onRejected, e2);
      }, l.resolve = function(e2, t2) {
        var r2 = p(c, t2);
        if ("error" === r2.status)
          return l.reject(e2, r2.value);
        var n2 = r2.value;
        if (n2)
          d(e2, n2);
        else {
          e2.state = a, e2.outcome = t2;
          for (var i2 = -1, s2 = e2.queue.length; ++i2 < s2; )
            e2.queue[i2].callFulfilled(t2);
        }
        return e2;
      }, l.reject = function(e2, t2) {
        e2.state = s, e2.outcome = t2;
        for (var r2 = -1, n2 = e2.queue.length; ++r2 < n2; )
          e2.queue[r2].callRejected(t2);
        return e2;
      }, o.resolve = function(e2) {
        if (e2 instanceof this)
          return e2;
        return l.resolve(new this(u), e2);
      }, o.reject = function(e2) {
        var t2 = new this(u);
        return l.reject(t2, e2);
      }, o.all = function(e2) {
        var r2 = this;
        if ("[object Array]" !== Object.prototype.toString.call(e2))
          return this.reject(new TypeError("must be an array"));
        var n2 = e2.length, i2 = false;
        if (!n2)
          return this.resolve([]);
        var s2 = new Array(n2), a2 = 0, t2 = -1, o2 = new this(u);
        for (; ++t2 < n2; )
          h2(e2[t2], t2);
        return o2;
        function h2(e3, t3) {
          r2.resolve(e3).then(function(e4) {
            s2[t3] = e4, ++a2 !== n2 || i2 || (i2 = true, l.resolve(o2, s2));
          }, function(e4) {
            i2 || (i2 = true, l.reject(o2, e4));
          });
        }
      }, o.race = function(e2) {
        var t2 = this;
        if ("[object Array]" !== Object.prototype.toString.call(e2))
          return this.reject(new TypeError("must be an array"));
        var r2 = e2.length, n2 = false;
        if (!r2)
          return this.resolve([]);
        var i2 = -1, s2 = new this(u);
        for (; ++i2 < r2; )
          a2 = e2[i2], t2.resolve(a2).then(function(e3) {
            n2 || (n2 = true, l.resolve(s2, e3));
          }, function(e3) {
            n2 || (n2 = true, l.reject(s2, e3));
          });
        var a2;
        return s2;
      };
    }, { immediate: 36 }], 38: [function(e, t, r) {
      var n = {};
      (0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), t.exports = n;
    }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, t, r) {
      var a = e("./zlib/deflate"), o = e("./utils/common"), h = e("./utils/strings"), i = e("./zlib/messages"), s = e("./zlib/zstream"), u = Object.prototype.toString, l = 0, f = -1, c = 0, d = 8;
      function p(e2) {
        if (!(this instanceof p))
          return new p(e2);
        this.options = o.assign({ level: f, method: d, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: c, to: "" }, e2 || {});
        var t2 = this.options;
        t2.raw && 0 < t2.windowBits ? t2.windowBits = -t2.windowBits : t2.gzip && 0 < t2.windowBits && t2.windowBits < 16 && (t2.windowBits += 16), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new s(), this.strm.avail_out = 0;
        var r2 = a.deflateInit2(this.strm, t2.level, t2.method, t2.windowBits, t2.memLevel, t2.strategy);
        if (r2 !== l)
          throw new Error(i[r2]);
        if (t2.header && a.deflateSetHeader(this.strm, t2.header), t2.dictionary) {
          var n2;
          if (n2 = "string" == typeof t2.dictionary ? h.string2buf(t2.dictionary) : "[object ArrayBuffer]" === u.call(t2.dictionary) ? new Uint8Array(t2.dictionary) : t2.dictionary, (r2 = a.deflateSetDictionary(this.strm, n2)) !== l)
            throw new Error(i[r2]);
          this._dict_set = true;
        }
      }
      function n(e2, t2) {
        var r2 = new p(t2);
        if (r2.push(e2, true), r2.err)
          throw r2.msg || i[r2.err];
        return r2.result;
      }
      p.prototype.push = function(e2, t2) {
        var r2, n2, i2 = this.strm, s2 = this.options.chunkSize;
        if (this.ended)
          return false;
        n2 = t2 === ~~t2 ? t2 : true === t2 ? 4 : 0, "string" == typeof e2 ? i2.input = h.string2buf(e2) : "[object ArrayBuffer]" === u.call(e2) ? i2.input = new Uint8Array(e2) : i2.input = e2, i2.next_in = 0, i2.avail_in = i2.input.length;
        do {
          if (0 === i2.avail_out && (i2.output = new o.Buf8(s2), i2.next_out = 0, i2.avail_out = s2), 1 !== (r2 = a.deflate(i2, n2)) && r2 !== l)
            return this.onEnd(r2), !(this.ended = true);
          0 !== i2.avail_out && (0 !== i2.avail_in || 4 !== n2 && 2 !== n2) || ("string" === this.options.to ? this.onData(h.buf2binstring(o.shrinkBuf(i2.output, i2.next_out))) : this.onData(o.shrinkBuf(i2.output, i2.next_out)));
        } while ((0 < i2.avail_in || 0 === i2.avail_out) && 1 !== r2);
        return 4 === n2 ? (r2 = a.deflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === l) : 2 !== n2 || (this.onEnd(l), !(i2.avail_out = 0));
      }, p.prototype.onData = function(e2) {
        this.chunks.push(e2);
      }, p.prototype.onEnd = function(e2) {
        e2 === l && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
      }, r.Deflate = p, r.deflate = n, r.deflateRaw = function(e2, t2) {
        return (t2 = t2 || {}).raw = true, n(e2, t2);
      }, r.gzip = function(e2, t2) {
        return (t2 = t2 || {}).gzip = true, n(e2, t2);
      };
    }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, t, r) {
      var c = e("./zlib/inflate"), d = e("./utils/common"), p = e("./utils/strings"), m = e("./zlib/constants"), n = e("./zlib/messages"), i = e("./zlib/zstream"), s = e("./zlib/gzheader"), _ = Object.prototype.toString;
      function a(e2) {
        if (!(this instanceof a))
          return new a(e2);
        this.options = d.assign({ chunkSize: 16384, windowBits: 0, to: "" }, e2 || {});
        var t2 = this.options;
        t2.raw && 0 <= t2.windowBits && t2.windowBits < 16 && (t2.windowBits = -t2.windowBits, 0 === t2.windowBits && (t2.windowBits = -15)), !(0 <= t2.windowBits && t2.windowBits < 16) || e2 && e2.windowBits || (t2.windowBits += 32), 15 < t2.windowBits && t2.windowBits < 48 && 0 == (15 & t2.windowBits) && (t2.windowBits |= 15), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new i(), this.strm.avail_out = 0;
        var r2 = c.inflateInit2(this.strm, t2.windowBits);
        if (r2 !== m.Z_OK)
          throw new Error(n[r2]);
        this.header = new s(), c.inflateGetHeader(this.strm, this.header);
      }
      function o(e2, t2) {
        var r2 = new a(t2);
        if (r2.push(e2, true), r2.err)
          throw r2.msg || n[r2.err];
        return r2.result;
      }
      a.prototype.push = function(e2, t2) {
        var r2, n2, i2, s2, a2, o2, h = this.strm, u = this.options.chunkSize, l = this.options.dictionary, f = false;
        if (this.ended)
          return false;
        n2 = t2 === ~~t2 ? t2 : true === t2 ? m.Z_FINISH : m.Z_NO_FLUSH, "string" == typeof e2 ? h.input = p.binstring2buf(e2) : "[object ArrayBuffer]" === _.call(e2) ? h.input = new Uint8Array(e2) : h.input = e2, h.next_in = 0, h.avail_in = h.input.length;
        do {
          if (0 === h.avail_out && (h.output = new d.Buf8(u), h.next_out = 0, h.avail_out = u), (r2 = c.inflate(h, m.Z_NO_FLUSH)) === m.Z_NEED_DICT && l && (o2 = "string" == typeof l ? p.string2buf(l) : "[object ArrayBuffer]" === _.call(l) ? new Uint8Array(l) : l, r2 = c.inflateSetDictionary(this.strm, o2)), r2 === m.Z_BUF_ERROR && true === f && (r2 = m.Z_OK, f = false), r2 !== m.Z_STREAM_END && r2 !== m.Z_OK)
            return this.onEnd(r2), !(this.ended = true);
          h.next_out && (0 !== h.avail_out && r2 !== m.Z_STREAM_END && (0 !== h.avail_in || n2 !== m.Z_FINISH && n2 !== m.Z_SYNC_FLUSH) || ("string" === this.options.to ? (i2 = p.utf8border(h.output, h.next_out), s2 = h.next_out - i2, a2 = p.buf2string(h.output, i2), h.next_out = s2, h.avail_out = u - s2, s2 && d.arraySet(h.output, h.output, i2, s2, 0), this.onData(a2)) : this.onData(d.shrinkBuf(h.output, h.next_out)))), 0 === h.avail_in && 0 === h.avail_out && (f = true);
        } while ((0 < h.avail_in || 0 === h.avail_out) && r2 !== m.Z_STREAM_END);
        return r2 === m.Z_STREAM_END && (n2 = m.Z_FINISH), n2 === m.Z_FINISH ? (r2 = c.inflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === m.Z_OK) : n2 !== m.Z_SYNC_FLUSH || (this.onEnd(m.Z_OK), !(h.avail_out = 0));
      }, a.prototype.onData = function(e2) {
        this.chunks.push(e2);
      }, a.prototype.onEnd = function(e2) {
        e2 === m.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = d.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
      }, r.Inflate = a, r.inflate = o, r.inflateRaw = function(e2, t2) {
        return (t2 = t2 || {}).raw = true, o(e2, t2);
      }, r.ungzip = o;
    }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, t, r) {
      var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
      r.assign = function(e2) {
        for (var t2 = Array.prototype.slice.call(arguments, 1); t2.length; ) {
          var r2 = t2.shift();
          if (r2) {
            if ("object" != typeof r2)
              throw new TypeError(r2 + "must be non-object");
            for (var n2 in r2)
              r2.hasOwnProperty(n2) && (e2[n2] = r2[n2]);
          }
        }
        return e2;
      }, r.shrinkBuf = function(e2, t2) {
        return e2.length === t2 ? e2 : e2.subarray ? e2.subarray(0, t2) : (e2.length = t2, e2);
      };
      var i = { arraySet: function(e2, t2, r2, n2, i2) {
        if (t2.subarray && e2.subarray)
          e2.set(t2.subarray(r2, r2 + n2), i2);
        else
          for (var s2 = 0; s2 < n2; s2++)
            e2[i2 + s2] = t2[r2 + s2];
      }, flattenChunks: function(e2) {
        var t2, r2, n2, i2, s2, a;
        for (t2 = n2 = 0, r2 = e2.length; t2 < r2; t2++)
          n2 += e2[t2].length;
        for (a = new Uint8Array(n2), t2 = i2 = 0, r2 = e2.length; t2 < r2; t2++)
          s2 = e2[t2], a.set(s2, i2), i2 += s2.length;
        return a;
      } }, s = { arraySet: function(e2, t2, r2, n2, i2) {
        for (var s2 = 0; s2 < n2; s2++)
          e2[i2 + s2] = t2[r2 + s2];
      }, flattenChunks: function(e2) {
        return [].concat.apply([], e2);
      } };
      r.setTyped = function(e2) {
        e2 ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, i)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, s));
      }, r.setTyped(n);
    }, {}], 42: [function(e, t, r) {
      var h = e("./common"), i = true, s = true;
      try {
        String.fromCharCode.apply(null, [0]);
      } catch (e2) {
        i = false;
      }
      try {
        String.fromCharCode.apply(null, new Uint8Array(1));
      } catch (e2) {
        s = false;
      }
      for (var u = new h.Buf8(256), n = 0; n < 256; n++)
        u[n] = 252 <= n ? 6 : 248 <= n ? 5 : 240 <= n ? 4 : 224 <= n ? 3 : 192 <= n ? 2 : 1;
      function l(e2, t2) {
        if (t2 < 65537 && (e2.subarray && s || !e2.subarray && i))
          return String.fromCharCode.apply(null, h.shrinkBuf(e2, t2));
        for (var r2 = "", n2 = 0; n2 < t2; n2++)
          r2 += String.fromCharCode(e2[n2]);
        return r2;
      }
      u[254] = u[254] = 1, r.string2buf = function(e2) {
        var t2, r2, n2, i2, s2, a = e2.length, o = 0;
        for (i2 = 0; i2 < a; i2++)
          55296 == (64512 & (r2 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
        for (t2 = new h.Buf8(o), i2 = s2 = 0; s2 < o; i2++)
          55296 == (64512 & (r2 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
        return t2;
      }, r.buf2binstring = function(e2) {
        return l(e2, e2.length);
      }, r.binstring2buf = function(e2) {
        for (var t2 = new h.Buf8(e2.length), r2 = 0, n2 = t2.length; r2 < n2; r2++)
          t2[r2] = e2.charCodeAt(r2);
        return t2;
      }, r.buf2string = function(e2, t2) {
        var r2, n2, i2, s2, a = t2 || e2.length, o = new Array(2 * a);
        for (r2 = n2 = 0; r2 < a; )
          if ((i2 = e2[r2++]) < 128)
            o[n2++] = i2;
          else if (4 < (s2 = u[i2]))
            o[n2++] = 65533, r2 += s2 - 1;
          else {
            for (i2 &= 2 === s2 ? 31 : 3 === s2 ? 15 : 7; 1 < s2 && r2 < a; )
              i2 = i2 << 6 | 63 & e2[r2++], s2--;
            1 < s2 ? o[n2++] = 65533 : i2 < 65536 ? o[n2++] = i2 : (i2 -= 65536, o[n2++] = 55296 | i2 >> 10 & 1023, o[n2++] = 56320 | 1023 & i2);
          }
        return l(o, n2);
      }, r.utf8border = function(e2, t2) {
        var r2;
        for ((t2 = t2 || e2.length) > e2.length && (t2 = e2.length), r2 = t2 - 1; 0 <= r2 && 128 == (192 & e2[r2]); )
          r2--;
        return r2 < 0 ? t2 : 0 === r2 ? t2 : r2 + u[e2[r2]] > t2 ? r2 : t2;
      };
    }, { "./common": 41 }], 43: [function(e, t, r) {
      t.exports = function(e2, t2, r2, n) {
        for (var i = 65535 & e2 | 0, s = e2 >>> 16 & 65535 | 0, a = 0; 0 !== r2; ) {
          for (r2 -= a = 2e3 < r2 ? 2e3 : r2; s = s + (i = i + t2[n++] | 0) | 0, --a; )
            ;
          i %= 65521, s %= 65521;
        }
        return i | s << 16 | 0;
      };
    }, {}], 44: [function(e, t, r) {
      t.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
    }, {}], 45: [function(e, t, r) {
      var o = function() {
        for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
          e2 = r2;
          for (var n = 0; n < 8; n++)
            e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
          t2[r2] = e2;
        }
        return t2;
      }();
      t.exports = function(e2, t2, r2, n) {
        var i = o, s = n + r2;
        e2 ^= -1;
        for (var a = n; a < s; a++)
          e2 = e2 >>> 8 ^ i[255 & (e2 ^ t2[a])];
        return -1 ^ e2;
      };
    }, {}], 46: [function(e, t, r) {
      var h, c = e("../utils/common"), u = e("./trees"), d = e("./adler32"), p = e("./crc32"), n = e("./messages"), l = 0, f = 4, m = 0, _ = -2, g = -1, b = 4, i = 2, v = 8, y = 9, s = 286, a = 30, o = 19, w = 2 * s + 1, k = 15, x = 3, S = 258, z = S + x + 1, C = 42, E = 113, A = 1, I = 2, O = 3, B = 4;
      function R(e2, t2) {
        return e2.msg = n[t2], t2;
      }
      function T(e2) {
        return (e2 << 1) - (4 < e2 ? 9 : 0);
      }
      function D(e2) {
        for (var t2 = e2.length; 0 <= --t2; )
          e2[t2] = 0;
      }
      function F(e2) {
        var t2 = e2.state, r2 = t2.pending;
        r2 > e2.avail_out && (r2 = e2.avail_out), 0 !== r2 && (c.arraySet(e2.output, t2.pending_buf, t2.pending_out, r2, e2.next_out), e2.next_out += r2, t2.pending_out += r2, e2.total_out += r2, e2.avail_out -= r2, t2.pending -= r2, 0 === t2.pending && (t2.pending_out = 0));
      }
      function N(e2, t2) {
        u._tr_flush_block(e2, 0 <= e2.block_start ? e2.block_start : -1, e2.strstart - e2.block_start, t2), e2.block_start = e2.strstart, F(e2.strm);
      }
      function U(e2, t2) {
        e2.pending_buf[e2.pending++] = t2;
      }
      function P(e2, t2) {
        e2.pending_buf[e2.pending++] = t2 >>> 8 & 255, e2.pending_buf[e2.pending++] = 255 & t2;
      }
      function L(e2, t2) {
        var r2, n2, i2 = e2.max_chain_length, s2 = e2.strstart, a2 = e2.prev_length, o2 = e2.nice_match, h2 = e2.strstart > e2.w_size - z ? e2.strstart - (e2.w_size - z) : 0, u2 = e2.window, l2 = e2.w_mask, f2 = e2.prev, c2 = e2.strstart + S, d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
        e2.prev_length >= e2.good_match && (i2 >>= 2), o2 > e2.lookahead && (o2 = e2.lookahead);
        do {
          if (u2[(r2 = t2) + a2] === p2 && u2[r2 + a2 - 1] === d2 && u2[r2] === u2[s2] && u2[++r2] === u2[s2 + 1]) {
            s2 += 2, r2++;
            do {
            } while (u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && s2 < c2);
            if (n2 = S - (c2 - s2), s2 = c2 - S, a2 < n2) {
              if (e2.match_start = t2, o2 <= (a2 = n2))
                break;
              d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
            }
          }
        } while ((t2 = f2[t2 & l2]) > h2 && 0 != --i2);
        return a2 <= e2.lookahead ? a2 : e2.lookahead;
      }
      function j(e2) {
        var t2, r2, n2, i2, s2, a2, o2, h2, u2, l2, f2 = e2.w_size;
        do {
          if (i2 = e2.window_size - e2.lookahead - e2.strstart, e2.strstart >= f2 + (f2 - z)) {
            for (c.arraySet(e2.window, e2.window, f2, f2, 0), e2.match_start -= f2, e2.strstart -= f2, e2.block_start -= f2, t2 = r2 = e2.hash_size; n2 = e2.head[--t2], e2.head[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; )
              ;
            for (t2 = r2 = f2; n2 = e2.prev[--t2], e2.prev[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; )
              ;
            i2 += f2;
          }
          if (0 === e2.strm.avail_in)
            break;
          if (a2 = e2.strm, o2 = e2.window, h2 = e2.strstart + e2.lookahead, u2 = i2, l2 = void 0, l2 = a2.avail_in, u2 < l2 && (l2 = u2), r2 = 0 === l2 ? 0 : (a2.avail_in -= l2, c.arraySet(o2, a2.input, a2.next_in, l2, h2), 1 === a2.state.wrap ? a2.adler = d(a2.adler, o2, l2, h2) : 2 === a2.state.wrap && (a2.adler = p(a2.adler, o2, l2, h2)), a2.next_in += l2, a2.total_in += l2, l2), e2.lookahead += r2, e2.lookahead + e2.insert >= x)
            for (s2 = e2.strstart - e2.insert, e2.ins_h = e2.window[s2], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + 1]) & e2.hash_mask; e2.insert && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + x - 1]) & e2.hash_mask, e2.prev[s2 & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = s2, s2++, e2.insert--, !(e2.lookahead + e2.insert < x)); )
              ;
        } while (e2.lookahead < z && 0 !== e2.strm.avail_in);
      }
      function Z(e2, t2) {
        for (var r2, n2; ; ) {
          if (e2.lookahead < z) {
            if (j(e2), e2.lookahead < z && t2 === l)
              return A;
            if (0 === e2.lookahead)
              break;
          }
          if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 !== r2 && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2)), e2.match_length >= x)
            if (n2 = u._tr_tally(e2, e2.strstart - e2.match_start, e2.match_length - x), e2.lookahead -= e2.match_length, e2.match_length <= e2.max_lazy_match && e2.lookahead >= x) {
              for (e2.match_length--; e2.strstart++, e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart, 0 != --e2.match_length; )
                ;
              e2.strstart++;
            } else
              e2.strstart += e2.match_length, e2.match_length = 0, e2.ins_h = e2.window[e2.strstart], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + 1]) & e2.hash_mask;
          else
            n2 = u._tr_tally(e2, 0, e2.window[e2.strstart]), e2.lookahead--, e2.strstart++;
          if (n2 && (N(e2, false), 0 === e2.strm.avail_out))
            return A;
        }
        return e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I;
      }
      function W(e2, t2) {
        for (var r2, n2, i2; ; ) {
          if (e2.lookahead < z) {
            if (j(e2), e2.lookahead < z && t2 === l)
              return A;
            if (0 === e2.lookahead)
              break;
          }
          if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), e2.prev_length = e2.match_length, e2.prev_match = e2.match_start, e2.match_length = x - 1, 0 !== r2 && e2.prev_length < e2.max_lazy_match && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2), e2.match_length <= 5 && (1 === e2.strategy || e2.match_length === x && 4096 < e2.strstart - e2.match_start) && (e2.match_length = x - 1)), e2.prev_length >= x && e2.match_length <= e2.prev_length) {
            for (i2 = e2.strstart + e2.lookahead - x, n2 = u._tr_tally(e2, e2.strstart - 1 - e2.prev_match, e2.prev_length - x), e2.lookahead -= e2.prev_length - 1, e2.prev_length -= 2; ++e2.strstart <= i2 && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 != --e2.prev_length; )
              ;
            if (e2.match_available = 0, e2.match_length = x - 1, e2.strstart++, n2 && (N(e2, false), 0 === e2.strm.avail_out))
              return A;
          } else if (e2.match_available) {
            if ((n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1])) && N(e2, false), e2.strstart++, e2.lookahead--, 0 === e2.strm.avail_out)
              return A;
          } else
            e2.match_available = 1, e2.strstart++, e2.lookahead--;
        }
        return e2.match_available && (n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1]), e2.match_available = 0), e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I;
      }
      function M(e2, t2, r2, n2, i2) {
        this.good_length = e2, this.max_lazy = t2, this.nice_length = r2, this.max_chain = n2, this.func = i2;
      }
      function H() {
        this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new c.Buf16(2 * w), this.dyn_dtree = new c.Buf16(2 * (2 * a + 1)), this.bl_tree = new c.Buf16(2 * (2 * o + 1)), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new c.Buf16(k + 1), this.heap = new c.Buf16(2 * s + 1), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new c.Buf16(2 * s + 1), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
      }
      function G(e2) {
        var t2;
        return e2 && e2.state ? (e2.total_in = e2.total_out = 0, e2.data_type = i, (t2 = e2.state).pending = 0, t2.pending_out = 0, t2.wrap < 0 && (t2.wrap = -t2.wrap), t2.status = t2.wrap ? C : E, e2.adler = 2 === t2.wrap ? 0 : 1, t2.last_flush = l, u._tr_init(t2), m) : R(e2, _);
      }
      function K(e2) {
        var t2 = G(e2);
        return t2 === m && function(e3) {
          e3.window_size = 2 * e3.w_size, D(e3.head), e3.max_lazy_match = h[e3.level].max_lazy, e3.good_match = h[e3.level].good_length, e3.nice_match = h[e3.level].nice_length, e3.max_chain_length = h[e3.level].max_chain, e3.strstart = 0, e3.block_start = 0, e3.lookahead = 0, e3.insert = 0, e3.match_length = e3.prev_length = x - 1, e3.match_available = 0, e3.ins_h = 0;
        }(e2.state), t2;
      }
      function Y(e2, t2, r2, n2, i2, s2) {
        if (!e2)
          return _;
        var a2 = 1;
        if (t2 === g && (t2 = 6), n2 < 0 ? (a2 = 0, n2 = -n2) : 15 < n2 && (a2 = 2, n2 -= 16), i2 < 1 || y < i2 || r2 !== v || n2 < 8 || 15 < n2 || t2 < 0 || 9 < t2 || s2 < 0 || b < s2)
          return R(e2, _);
        8 === n2 && (n2 = 9);
        var o2 = new H();
        return (e2.state = o2).strm = e2, o2.wrap = a2, o2.gzhead = null, o2.w_bits = n2, o2.w_size = 1 << o2.w_bits, o2.w_mask = o2.w_size - 1, o2.hash_bits = i2 + 7, o2.hash_size = 1 << o2.hash_bits, o2.hash_mask = o2.hash_size - 1, o2.hash_shift = ~~((o2.hash_bits + x - 1) / x), o2.window = new c.Buf8(2 * o2.w_size), o2.head = new c.Buf16(o2.hash_size), o2.prev = new c.Buf16(o2.w_size), o2.lit_bufsize = 1 << i2 + 6, o2.pending_buf_size = 4 * o2.lit_bufsize, o2.pending_buf = new c.Buf8(o2.pending_buf_size), o2.d_buf = 1 * o2.lit_bufsize, o2.l_buf = 3 * o2.lit_bufsize, o2.level = t2, o2.strategy = s2, o2.method = r2, K(e2);
      }
      h = [new M(0, 0, 0, 0, function(e2, t2) {
        var r2 = 65535;
        for (r2 > e2.pending_buf_size - 5 && (r2 = e2.pending_buf_size - 5); ; ) {
          if (e2.lookahead <= 1) {
            if (j(e2), 0 === e2.lookahead && t2 === l)
              return A;
            if (0 === e2.lookahead)
              break;
          }
          e2.strstart += e2.lookahead, e2.lookahead = 0;
          var n2 = e2.block_start + r2;
          if ((0 === e2.strstart || e2.strstart >= n2) && (e2.lookahead = e2.strstart - n2, e2.strstart = n2, N(e2, false), 0 === e2.strm.avail_out))
            return A;
          if (e2.strstart - e2.block_start >= e2.w_size - z && (N(e2, false), 0 === e2.strm.avail_out))
            return A;
        }
        return e2.insert = 0, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : (e2.strstart > e2.block_start && (N(e2, false), e2.strm.avail_out), A);
      }), new M(4, 4, 8, 4, Z), new M(4, 5, 16, 8, Z), new M(4, 6, 32, 32, Z), new M(4, 4, 16, 16, W), new M(8, 16, 32, 32, W), new M(8, 16, 128, 128, W), new M(8, 32, 128, 256, W), new M(32, 128, 258, 1024, W), new M(32, 258, 258, 4096, W)], r.deflateInit = function(e2, t2) {
        return Y(e2, t2, v, 15, 8, 0);
      }, r.deflateInit2 = Y, r.deflateReset = K, r.deflateResetKeep = G, r.deflateSetHeader = function(e2, t2) {
        return e2 && e2.state ? 2 !== e2.state.wrap ? _ : (e2.state.gzhead = t2, m) : _;
      }, r.deflate = function(e2, t2) {
        var r2, n2, i2, s2;
        if (!e2 || !e2.state || 5 < t2 || t2 < 0)
          return e2 ? R(e2, _) : _;
        if (n2 = e2.state, !e2.output || !e2.input && 0 !== e2.avail_in || 666 === n2.status && t2 !== f)
          return R(e2, 0 === e2.avail_out ? -5 : _);
        if (n2.strm = e2, r2 = n2.last_flush, n2.last_flush = t2, n2.status === C)
          if (2 === n2.wrap)
            e2.adler = 0, U(n2, 31), U(n2, 139), U(n2, 8), n2.gzhead ? (U(n2, (n2.gzhead.text ? 1 : 0) + (n2.gzhead.hcrc ? 2 : 0) + (n2.gzhead.extra ? 4 : 0) + (n2.gzhead.name ? 8 : 0) + (n2.gzhead.comment ? 16 : 0)), U(n2, 255 & n2.gzhead.time), U(n2, n2.gzhead.time >> 8 & 255), U(n2, n2.gzhead.time >> 16 & 255), U(n2, n2.gzhead.time >> 24 & 255), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 255 & n2.gzhead.os), n2.gzhead.extra && n2.gzhead.extra.length && (U(n2, 255 & n2.gzhead.extra.length), U(n2, n2.gzhead.extra.length >> 8 & 255)), n2.gzhead.hcrc && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending, 0)), n2.gzindex = 0, n2.status = 69) : (U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 3), n2.status = E);
          else {
            var a2 = v + (n2.w_bits - 8 << 4) << 8;
            a2 |= (2 <= n2.strategy || n2.level < 2 ? 0 : n2.level < 6 ? 1 : 6 === n2.level ? 2 : 3) << 6, 0 !== n2.strstart && (a2 |= 32), a2 += 31 - a2 % 31, n2.status = E, P(n2, a2), 0 !== n2.strstart && (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), e2.adler = 1;
          }
        if (69 === n2.status)
          if (n2.gzhead.extra) {
            for (i2 = n2.pending; n2.gzindex < (65535 & n2.gzhead.extra.length) && (n2.pending !== n2.pending_buf_size || (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending !== n2.pending_buf_size)); )
              U(n2, 255 & n2.gzhead.extra[n2.gzindex]), n2.gzindex++;
            n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), n2.gzindex === n2.gzhead.extra.length && (n2.gzindex = 0, n2.status = 73);
          } else
            n2.status = 73;
        if (73 === n2.status)
          if (n2.gzhead.name) {
            i2 = n2.pending;
            do {
              if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                s2 = 1;
                break;
              }
              s2 = n2.gzindex < n2.gzhead.name.length ? 255 & n2.gzhead.name.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
            } while (0 !== s2);
            n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.gzindex = 0, n2.status = 91);
          } else
            n2.status = 91;
        if (91 === n2.status)
          if (n2.gzhead.comment) {
            i2 = n2.pending;
            do {
              if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                s2 = 1;
                break;
              }
              s2 = n2.gzindex < n2.gzhead.comment.length ? 255 & n2.gzhead.comment.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
            } while (0 !== s2);
            n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.status = 103);
          } else
            n2.status = 103;
        if (103 === n2.status && (n2.gzhead.hcrc ? (n2.pending + 2 > n2.pending_buf_size && F(e2), n2.pending + 2 <= n2.pending_buf_size && (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), e2.adler = 0, n2.status = E)) : n2.status = E), 0 !== n2.pending) {
          if (F(e2), 0 === e2.avail_out)
            return n2.last_flush = -1, m;
        } else if (0 === e2.avail_in && T(t2) <= T(r2) && t2 !== f)
          return R(e2, -5);
        if (666 === n2.status && 0 !== e2.avail_in)
          return R(e2, -5);
        if (0 !== e2.avail_in || 0 !== n2.lookahead || t2 !== l && 666 !== n2.status) {
          var o2 = 2 === n2.strategy ? function(e3, t3) {
            for (var r3; ; ) {
              if (0 === e3.lookahead && (j(e3), 0 === e3.lookahead)) {
                if (t3 === l)
                  return A;
                break;
              }
              if (e3.match_length = 0, r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++, r3 && (N(e3, false), 0 === e3.strm.avail_out))
                return A;
            }
            return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I;
          }(n2, t2) : 3 === n2.strategy ? function(e3, t3) {
            for (var r3, n3, i3, s3, a3 = e3.window; ; ) {
              if (e3.lookahead <= S) {
                if (j(e3), e3.lookahead <= S && t3 === l)
                  return A;
                if (0 === e3.lookahead)
                  break;
              }
              if (e3.match_length = 0, e3.lookahead >= x && 0 < e3.strstart && (n3 = a3[i3 = e3.strstart - 1]) === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3]) {
                s3 = e3.strstart + S;
                do {
                } while (n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && i3 < s3);
                e3.match_length = S - (s3 - i3), e3.match_length > e3.lookahead && (e3.match_length = e3.lookahead);
              }
              if (e3.match_length >= x ? (r3 = u._tr_tally(e3, 1, e3.match_length - x), e3.lookahead -= e3.match_length, e3.strstart += e3.match_length, e3.match_length = 0) : (r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++), r3 && (N(e3, false), 0 === e3.strm.avail_out))
                return A;
            }
            return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I;
          }(n2, t2) : h[n2.level].func(n2, t2);
          if (o2 !== O && o2 !== B || (n2.status = 666), o2 === A || o2 === O)
            return 0 === e2.avail_out && (n2.last_flush = -1), m;
          if (o2 === I && (1 === t2 ? u._tr_align(n2) : 5 !== t2 && (u._tr_stored_block(n2, 0, 0, false), 3 === t2 && (D(n2.head), 0 === n2.lookahead && (n2.strstart = 0, n2.block_start = 0, n2.insert = 0))), F(e2), 0 === e2.avail_out))
            return n2.last_flush = -1, m;
        }
        return t2 !== f ? m : n2.wrap <= 0 ? 1 : (2 === n2.wrap ? (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), U(n2, e2.adler >> 16 & 255), U(n2, e2.adler >> 24 & 255), U(n2, 255 & e2.total_in), U(n2, e2.total_in >> 8 & 255), U(n2, e2.total_in >> 16 & 255), U(n2, e2.total_in >> 24 & 255)) : (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), F(e2), 0 < n2.wrap && (n2.wrap = -n2.wrap), 0 !== n2.pending ? m : 1);
      }, r.deflateEnd = function(e2) {
        var t2;
        return e2 && e2.state ? (t2 = e2.state.status) !== C && 69 !== t2 && 73 !== t2 && 91 !== t2 && 103 !== t2 && t2 !== E && 666 !== t2 ? R(e2, _) : (e2.state = null, t2 === E ? R(e2, -3) : m) : _;
      }, r.deflateSetDictionary = function(e2, t2) {
        var r2, n2, i2, s2, a2, o2, h2, u2, l2 = t2.length;
        if (!e2 || !e2.state)
          return _;
        if (2 === (s2 = (r2 = e2.state).wrap) || 1 === s2 && r2.status !== C || r2.lookahead)
          return _;
        for (1 === s2 && (e2.adler = d(e2.adler, t2, l2, 0)), r2.wrap = 0, l2 >= r2.w_size && (0 === s2 && (D(r2.head), r2.strstart = 0, r2.block_start = 0, r2.insert = 0), u2 = new c.Buf8(r2.w_size), c.arraySet(u2, t2, l2 - r2.w_size, r2.w_size, 0), t2 = u2, l2 = r2.w_size), a2 = e2.avail_in, o2 = e2.next_in, h2 = e2.input, e2.avail_in = l2, e2.next_in = 0, e2.input = t2, j(r2); r2.lookahead >= x; ) {
          for (n2 = r2.strstart, i2 = r2.lookahead - (x - 1); r2.ins_h = (r2.ins_h << r2.hash_shift ^ r2.window[n2 + x - 1]) & r2.hash_mask, r2.prev[n2 & r2.w_mask] = r2.head[r2.ins_h], r2.head[r2.ins_h] = n2, n2++, --i2; )
            ;
          r2.strstart = n2, r2.lookahead = x - 1, j(r2);
        }
        return r2.strstart += r2.lookahead, r2.block_start = r2.strstart, r2.insert = r2.lookahead, r2.lookahead = 0, r2.match_length = r2.prev_length = x - 1, r2.match_available = 0, e2.next_in = o2, e2.input = h2, e2.avail_in = a2, r2.wrap = s2, m;
      }, r.deflateInfo = "pako deflate (from Nodeca project)";
    }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, t, r) {
      t.exports = function() {
        this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = false;
      };
    }, {}], 48: [function(e, t, r) {
      t.exports = function(e2, t2) {
        var r2, n, i, s, a, o, h, u, l, f, c, d, p, m, _, g, b, v, y, w, k, x, S, z, C;
        r2 = e2.state, n = e2.next_in, z = e2.input, i = n + (e2.avail_in - 5), s = e2.next_out, C = e2.output, a = s - (t2 - e2.avail_out), o = s + (e2.avail_out - 257), h = r2.dmax, u = r2.wsize, l = r2.whave, f = r2.wnext, c = r2.window, d = r2.hold, p = r2.bits, m = r2.lencode, _ = r2.distcode, g = (1 << r2.lenbits) - 1, b = (1 << r2.distbits) - 1;
        e:
          do {
            p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = m[d & g];
            t:
              for (; ; ) {
                if (d >>>= y = v >>> 24, p -= y, 0 === (y = v >>> 16 & 255))
                  C[s++] = 65535 & v;
                else {
                  if (!(16 & y)) {
                    if (0 == (64 & y)) {
                      v = m[(65535 & v) + (d & (1 << y) - 1)];
                      continue t;
                    }
                    if (32 & y) {
                      r2.mode = 12;
                      break e;
                    }
                    e2.msg = "invalid literal/length code", r2.mode = 30;
                    break e;
                  }
                  w = 65535 & v, (y &= 15) && (p < y && (d += z[n++] << p, p += 8), w += d & (1 << y) - 1, d >>>= y, p -= y), p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = _[d & b];
                  r:
                    for (; ; ) {
                      if (d >>>= y = v >>> 24, p -= y, !(16 & (y = v >>> 16 & 255))) {
                        if (0 == (64 & y)) {
                          v = _[(65535 & v) + (d & (1 << y) - 1)];
                          continue r;
                        }
                        e2.msg = "invalid distance code", r2.mode = 30;
                        break e;
                      }
                      if (k = 65535 & v, p < (y &= 15) && (d += z[n++] << p, (p += 8) < y && (d += z[n++] << p, p += 8)), h < (k += d & (1 << y) - 1)) {
                        e2.msg = "invalid distance too far back", r2.mode = 30;
                        break e;
                      }
                      if (d >>>= y, p -= y, (y = s - a) < k) {
                        if (l < (y = k - y) && r2.sane) {
                          e2.msg = "invalid distance too far back", r2.mode = 30;
                          break e;
                        }
                        if (S = c, (x = 0) === f) {
                          if (x += u - y, y < w) {
                            for (w -= y; C[s++] = c[x++], --y; )
                              ;
                            x = s - k, S = C;
                          }
                        } else if (f < y) {
                          if (x += u + f - y, (y -= f) < w) {
                            for (w -= y; C[s++] = c[x++], --y; )
                              ;
                            if (x = 0, f < w) {
                              for (w -= y = f; C[s++] = c[x++], --y; )
                                ;
                              x = s - k, S = C;
                            }
                          }
                        } else if (x += f - y, y < w) {
                          for (w -= y; C[s++] = c[x++], --y; )
                            ;
                          x = s - k, S = C;
                        }
                        for (; 2 < w; )
                          C[s++] = S[x++], C[s++] = S[x++], C[s++] = S[x++], w -= 3;
                        w && (C[s++] = S[x++], 1 < w && (C[s++] = S[x++]));
                      } else {
                        for (x = s - k; C[s++] = C[x++], C[s++] = C[x++], C[s++] = C[x++], 2 < (w -= 3); )
                          ;
                        w && (C[s++] = C[x++], 1 < w && (C[s++] = C[x++]));
                      }
                      break;
                    }
                }
                break;
              }
          } while (n < i && s < o);
        n -= w = p >> 3, d &= (1 << (p -= w << 3)) - 1, e2.next_in = n, e2.next_out = s, e2.avail_in = n < i ? i - n + 5 : 5 - (n - i), e2.avail_out = s < o ? o - s + 257 : 257 - (s - o), r2.hold = d, r2.bits = p;
      };
    }, {}], 49: [function(e, t, r) {
      var I = e("../utils/common"), O = e("./adler32"), B = e("./crc32"), R = e("./inffast"), T = e("./inftrees"), D = 1, F = 2, N = 0, U = -2, P = 1, n = 852, i = 592;
      function L(e2) {
        return (e2 >>> 24 & 255) + (e2 >>> 8 & 65280) + ((65280 & e2) << 8) + ((255 & e2) << 24);
      }
      function s() {
        this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new I.Buf16(320), this.work = new I.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
      }
      function a(e2) {
        var t2;
        return e2 && e2.state ? (t2 = e2.state, e2.total_in = e2.total_out = t2.total = 0, e2.msg = "", t2.wrap && (e2.adler = 1 & t2.wrap), t2.mode = P, t2.last = 0, t2.havedict = 0, t2.dmax = 32768, t2.head = null, t2.hold = 0, t2.bits = 0, t2.lencode = t2.lendyn = new I.Buf32(n), t2.distcode = t2.distdyn = new I.Buf32(i), t2.sane = 1, t2.back = -1, N) : U;
      }
      function o(e2) {
        var t2;
        return e2 && e2.state ? ((t2 = e2.state).wsize = 0, t2.whave = 0, t2.wnext = 0, a(e2)) : U;
      }
      function h(e2, t2) {
        var r2, n2;
        return e2 && e2.state ? (n2 = e2.state, t2 < 0 ? (r2 = 0, t2 = -t2) : (r2 = 1 + (t2 >> 4), t2 < 48 && (t2 &= 15)), t2 && (t2 < 8 || 15 < t2) ? U : (null !== n2.window && n2.wbits !== t2 && (n2.window = null), n2.wrap = r2, n2.wbits = t2, o(e2))) : U;
      }
      function u(e2, t2) {
        var r2, n2;
        return e2 ? (n2 = new s(), (e2.state = n2).window = null, (r2 = h(e2, t2)) !== N && (e2.state = null), r2) : U;
      }
      var l, f, c = true;
      function j(e2) {
        if (c) {
          var t2;
          for (l = new I.Buf32(512), f = new I.Buf32(32), t2 = 0; t2 < 144; )
            e2.lens[t2++] = 8;
          for (; t2 < 256; )
            e2.lens[t2++] = 9;
          for (; t2 < 280; )
            e2.lens[t2++] = 7;
          for (; t2 < 288; )
            e2.lens[t2++] = 8;
          for (T(D, e2.lens, 0, 288, l, 0, e2.work, { bits: 9 }), t2 = 0; t2 < 32; )
            e2.lens[t2++] = 5;
          T(F, e2.lens, 0, 32, f, 0, e2.work, { bits: 5 }), c = false;
        }
        e2.lencode = l, e2.lenbits = 9, e2.distcode = f, e2.distbits = 5;
      }
      function Z(e2, t2, r2, n2) {
        var i2, s2 = e2.state;
        return null === s2.window && (s2.wsize = 1 << s2.wbits, s2.wnext = 0, s2.whave = 0, s2.window = new I.Buf8(s2.wsize)), n2 >= s2.wsize ? (I.arraySet(s2.window, t2, r2 - s2.wsize, s2.wsize, 0), s2.wnext = 0, s2.whave = s2.wsize) : (n2 < (i2 = s2.wsize - s2.wnext) && (i2 = n2), I.arraySet(s2.window, t2, r2 - n2, i2, s2.wnext), (n2 -= i2) ? (I.arraySet(s2.window, t2, r2 - n2, n2, 0), s2.wnext = n2, s2.whave = s2.wsize) : (s2.wnext += i2, s2.wnext === s2.wsize && (s2.wnext = 0), s2.whave < s2.wsize && (s2.whave += i2))), 0;
      }
      r.inflateReset = o, r.inflateReset2 = h, r.inflateResetKeep = a, r.inflateInit = function(e2) {
        return u(e2, 15);
      }, r.inflateInit2 = u, r.inflate = function(e2, t2) {
        var r2, n2, i2, s2, a2, o2, h2, u2, l2, f2, c2, d, p, m, _, g, b, v, y, w, k, x, S, z, C = 0, E = new I.Buf8(4), A = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
        if (!e2 || !e2.state || !e2.output || !e2.input && 0 !== e2.avail_in)
          return U;
        12 === (r2 = e2.state).mode && (r2.mode = 13), a2 = e2.next_out, i2 = e2.output, h2 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, f2 = o2, c2 = h2, x = N;
        e:
          for (; ; )
            switch (r2.mode) {
              case P:
                if (0 === r2.wrap) {
                  r2.mode = 13;
                  break;
                }
                for (; l2 < 16; ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (2 & r2.wrap && 35615 === u2) {
                  E[r2.check = 0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0), l2 = u2 = 0, r2.mode = 2;
                  break;
                }
                if (r2.flags = 0, r2.head && (r2.head.done = false), !(1 & r2.wrap) || (((255 & u2) << 8) + (u2 >> 8)) % 31) {
                  e2.msg = "incorrect header check", r2.mode = 30;
                  break;
                }
                if (8 != (15 & u2)) {
                  e2.msg = "unknown compression method", r2.mode = 30;
                  break;
                }
                if (l2 -= 4, k = 8 + (15 & (u2 >>>= 4)), 0 === r2.wbits)
                  r2.wbits = k;
                else if (k > r2.wbits) {
                  e2.msg = "invalid window size", r2.mode = 30;
                  break;
                }
                r2.dmax = 1 << k, e2.adler = r2.check = 1, r2.mode = 512 & u2 ? 10 : 12, l2 = u2 = 0;
                break;
              case 2:
                for (; l2 < 16; ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (r2.flags = u2, 8 != (255 & r2.flags)) {
                  e2.msg = "unknown compression method", r2.mode = 30;
                  break;
                }
                if (57344 & r2.flags) {
                  e2.msg = "unknown header flags set", r2.mode = 30;
                  break;
                }
                r2.head && (r2.head.text = u2 >> 8 & 1), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0, r2.mode = 3;
              case 3:
                for (; l2 < 32; ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                r2.head && (r2.head.time = u2), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, E[2] = u2 >>> 16 & 255, E[3] = u2 >>> 24 & 255, r2.check = B(r2.check, E, 4, 0)), l2 = u2 = 0, r2.mode = 4;
              case 4:
                for (; l2 < 16; ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                r2.head && (r2.head.xflags = 255 & u2, r2.head.os = u2 >> 8), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0, r2.mode = 5;
              case 5:
                if (1024 & r2.flags) {
                  for (; l2 < 16; ) {
                    if (0 === o2)
                      break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.length = u2, r2.head && (r2.head.extra_len = u2), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0;
                } else
                  r2.head && (r2.head.extra = null);
                r2.mode = 6;
              case 6:
                if (1024 & r2.flags && (o2 < (d = r2.length) && (d = o2), d && (r2.head && (k = r2.head.extra_len - r2.length, r2.head.extra || (r2.head.extra = new Array(r2.head.extra_len)), I.arraySet(r2.head.extra, n2, s2, d, k)), 512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, r2.length -= d), r2.length))
                  break e;
                r2.length = 0, r2.mode = 7;
              case 7:
                if (2048 & r2.flags) {
                  if (0 === o2)
                    break e;
                  for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.name += String.fromCharCode(k)), k && d < o2; )
                    ;
                  if (512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, k)
                    break e;
                } else
                  r2.head && (r2.head.name = null);
                r2.length = 0, r2.mode = 8;
              case 8:
                if (4096 & r2.flags) {
                  if (0 === o2)
                    break e;
                  for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.comment += String.fromCharCode(k)), k && d < o2; )
                    ;
                  if (512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, k)
                    break e;
                } else
                  r2.head && (r2.head.comment = null);
                r2.mode = 9;
              case 9:
                if (512 & r2.flags) {
                  for (; l2 < 16; ) {
                    if (0 === o2)
                      break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  if (u2 !== (65535 & r2.check)) {
                    e2.msg = "header crc mismatch", r2.mode = 30;
                    break;
                  }
                  l2 = u2 = 0;
                }
                r2.head && (r2.head.hcrc = r2.flags >> 9 & 1, r2.head.done = true), e2.adler = r2.check = 0, r2.mode = 12;
                break;
              case 10:
                for (; l2 < 32; ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                e2.adler = r2.check = L(u2), l2 = u2 = 0, r2.mode = 11;
              case 11:
                if (0 === r2.havedict)
                  return e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, 2;
                e2.adler = r2.check = 1, r2.mode = 12;
              case 12:
                if (5 === t2 || 6 === t2)
                  break e;
              case 13:
                if (r2.last) {
                  u2 >>>= 7 & l2, l2 -= 7 & l2, r2.mode = 27;
                  break;
                }
                for (; l2 < 3; ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                switch (r2.last = 1 & u2, l2 -= 1, 3 & (u2 >>>= 1)) {
                  case 0:
                    r2.mode = 14;
                    break;
                  case 1:
                    if (j(r2), r2.mode = 20, 6 !== t2)
                      break;
                    u2 >>>= 2, l2 -= 2;
                    break e;
                  case 2:
                    r2.mode = 17;
                    break;
                  case 3:
                    e2.msg = "invalid block type", r2.mode = 30;
                }
                u2 >>>= 2, l2 -= 2;
                break;
              case 14:
                for (u2 >>>= 7 & l2, l2 -= 7 & l2; l2 < 32; ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if ((65535 & u2) != (u2 >>> 16 ^ 65535)) {
                  e2.msg = "invalid stored block lengths", r2.mode = 30;
                  break;
                }
                if (r2.length = 65535 & u2, l2 = u2 = 0, r2.mode = 15, 6 === t2)
                  break e;
              case 15:
                r2.mode = 16;
              case 16:
                if (d = r2.length) {
                  if (o2 < d && (d = o2), h2 < d && (d = h2), 0 === d)
                    break e;
                  I.arraySet(i2, n2, s2, d, a2), o2 -= d, s2 += d, h2 -= d, a2 += d, r2.length -= d;
                  break;
                }
                r2.mode = 12;
                break;
              case 17:
                for (; l2 < 14; ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (r2.nlen = 257 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ndist = 1 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ncode = 4 + (15 & u2), u2 >>>= 4, l2 -= 4, 286 < r2.nlen || 30 < r2.ndist) {
                  e2.msg = "too many length or distance symbols", r2.mode = 30;
                  break;
                }
                r2.have = 0, r2.mode = 18;
              case 18:
                for (; r2.have < r2.ncode; ) {
                  for (; l2 < 3; ) {
                    if (0 === o2)
                      break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.lens[A[r2.have++]] = 7 & u2, u2 >>>= 3, l2 -= 3;
                }
                for (; r2.have < 19; )
                  r2.lens[A[r2.have++]] = 0;
                if (r2.lencode = r2.lendyn, r2.lenbits = 7, S = { bits: r2.lenbits }, x = T(0, r2.lens, 0, 19, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
                  e2.msg = "invalid code lengths set", r2.mode = 30;
                  break;
                }
                r2.have = 0, r2.mode = 19;
              case 19:
                for (; r2.have < r2.nlen + r2.ndist; ) {
                  for (; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                    if (0 === o2)
                      break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  if (b < 16)
                    u2 >>>= _, l2 -= _, r2.lens[r2.have++] = b;
                  else {
                    if (16 === b) {
                      for (z = _ + 2; l2 < z; ) {
                        if (0 === o2)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      if (u2 >>>= _, l2 -= _, 0 === r2.have) {
                        e2.msg = "invalid bit length repeat", r2.mode = 30;
                        break;
                      }
                      k = r2.lens[r2.have - 1], d = 3 + (3 & u2), u2 >>>= 2, l2 -= 2;
                    } else if (17 === b) {
                      for (z = _ + 3; l2 < z; ) {
                        if (0 === o2)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      l2 -= _, k = 0, d = 3 + (7 & (u2 >>>= _)), u2 >>>= 3, l2 -= 3;
                    } else {
                      for (z = _ + 7; l2 < z; ) {
                        if (0 === o2)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      l2 -= _, k = 0, d = 11 + (127 & (u2 >>>= _)), u2 >>>= 7, l2 -= 7;
                    }
                    if (r2.have + d > r2.nlen + r2.ndist) {
                      e2.msg = "invalid bit length repeat", r2.mode = 30;
                      break;
                    }
                    for (; d--; )
                      r2.lens[r2.have++] = k;
                  }
                }
                if (30 === r2.mode)
                  break;
                if (0 === r2.lens[256]) {
                  e2.msg = "invalid code -- missing end-of-block", r2.mode = 30;
                  break;
                }
                if (r2.lenbits = 9, S = { bits: r2.lenbits }, x = T(D, r2.lens, 0, r2.nlen, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
                  e2.msg = "invalid literal/lengths set", r2.mode = 30;
                  break;
                }
                if (r2.distbits = 6, r2.distcode = r2.distdyn, S = { bits: r2.distbits }, x = T(F, r2.lens, r2.nlen, r2.ndist, r2.distcode, 0, r2.work, S), r2.distbits = S.bits, x) {
                  e2.msg = "invalid distances set", r2.mode = 30;
                  break;
                }
                if (r2.mode = 20, 6 === t2)
                  break e;
              case 20:
                r2.mode = 21;
              case 21:
                if (6 <= o2 && 258 <= h2) {
                  e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, R(e2, c2), a2 = e2.next_out, i2 = e2.output, h2 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, 12 === r2.mode && (r2.back = -1);
                  break;
                }
                for (r2.back = 0; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (g && 0 == (240 & g)) {
                  for (v = _, y = g, w = b; g = (C = r2.lencode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                    if (0 === o2)
                      break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  u2 >>>= v, l2 -= v, r2.back += v;
                }
                if (u2 >>>= _, l2 -= _, r2.back += _, r2.length = b, 0 === g) {
                  r2.mode = 26;
                  break;
                }
                if (32 & g) {
                  r2.back = -1, r2.mode = 12;
                  break;
                }
                if (64 & g) {
                  e2.msg = "invalid literal/length code", r2.mode = 30;
                  break;
                }
                r2.extra = 15 & g, r2.mode = 22;
              case 22:
                if (r2.extra) {
                  for (z = r2.extra; l2 < z; ) {
                    if (0 === o2)
                      break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.length += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
                }
                r2.was = r2.length, r2.mode = 23;
              case 23:
                for (; g = (C = r2.distcode[u2 & (1 << r2.distbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (0 == (240 & g)) {
                  for (v = _, y = g, w = b; g = (C = r2.distcode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                    if (0 === o2)
                      break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  u2 >>>= v, l2 -= v, r2.back += v;
                }
                if (u2 >>>= _, l2 -= _, r2.back += _, 64 & g) {
                  e2.msg = "invalid distance code", r2.mode = 30;
                  break;
                }
                r2.offset = b, r2.extra = 15 & g, r2.mode = 24;
              case 24:
                if (r2.extra) {
                  for (z = r2.extra; l2 < z; ) {
                    if (0 === o2)
                      break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.offset += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
                }
                if (r2.offset > r2.dmax) {
                  e2.msg = "invalid distance too far back", r2.mode = 30;
                  break;
                }
                r2.mode = 25;
              case 25:
                if (0 === h2)
                  break e;
                if (d = c2 - h2, r2.offset > d) {
                  if ((d = r2.offset - d) > r2.whave && r2.sane) {
                    e2.msg = "invalid distance too far back", r2.mode = 30;
                    break;
                  }
                  p = d > r2.wnext ? (d -= r2.wnext, r2.wsize - d) : r2.wnext - d, d > r2.length && (d = r2.length), m = r2.window;
                } else
                  m = i2, p = a2 - r2.offset, d = r2.length;
                for (h2 < d && (d = h2), h2 -= d, r2.length -= d; i2[a2++] = m[p++], --d; )
                  ;
                0 === r2.length && (r2.mode = 21);
                break;
              case 26:
                if (0 === h2)
                  break e;
                i2[a2++] = r2.length, h2--, r2.mode = 21;
                break;
              case 27:
                if (r2.wrap) {
                  for (; l2 < 32; ) {
                    if (0 === o2)
                      break e;
                    o2--, u2 |= n2[s2++] << l2, l2 += 8;
                  }
                  if (c2 -= h2, e2.total_out += c2, r2.total += c2, c2 && (e2.adler = r2.check = r2.flags ? B(r2.check, i2, c2, a2 - c2) : O(r2.check, i2, c2, a2 - c2)), c2 = h2, (r2.flags ? u2 : L(u2)) !== r2.check) {
                    e2.msg = "incorrect data check", r2.mode = 30;
                    break;
                  }
                  l2 = u2 = 0;
                }
                r2.mode = 28;
              case 28:
                if (r2.wrap && r2.flags) {
                  for (; l2 < 32; ) {
                    if (0 === o2)
                      break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  if (u2 !== (4294967295 & r2.total)) {
                    e2.msg = "incorrect length check", r2.mode = 30;
                    break;
                  }
                  l2 = u2 = 0;
                }
                r2.mode = 29;
              case 29:
                x = 1;
                break e;
              case 30:
                x = -3;
                break e;
              case 31:
                return -4;
              case 32:
              default:
                return U;
            }
        return e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, (r2.wsize || c2 !== e2.avail_out && r2.mode < 30 && (r2.mode < 27 || 4 !== t2)) && Z(e2, e2.output, e2.next_out, c2 - e2.avail_out) ? (r2.mode = 31, -4) : (f2 -= e2.avail_in, c2 -= e2.avail_out, e2.total_in += f2, e2.total_out += c2, r2.total += c2, r2.wrap && c2 && (e2.adler = r2.check = r2.flags ? B(r2.check, i2, c2, e2.next_out - c2) : O(r2.check, i2, c2, e2.next_out - c2)), e2.data_type = r2.bits + (r2.last ? 64 : 0) + (12 === r2.mode ? 128 : 0) + (20 === r2.mode || 15 === r2.mode ? 256 : 0), (0 == f2 && 0 === c2 || 4 === t2) && x === N && (x = -5), x);
      }, r.inflateEnd = function(e2) {
        if (!e2 || !e2.state)
          return U;
        var t2 = e2.state;
        return t2.window && (t2.window = null), e2.state = null, N;
      }, r.inflateGetHeader = function(e2, t2) {
        var r2;
        return e2 && e2.state ? 0 == (2 & (r2 = e2.state).wrap) ? U : ((r2.head = t2).done = false, N) : U;
      }, r.inflateSetDictionary = function(e2, t2) {
        var r2, n2 = t2.length;
        return e2 && e2.state ? 0 !== (r2 = e2.state).wrap && 11 !== r2.mode ? U : 11 === r2.mode && O(1, t2, n2, 0) !== r2.check ? -3 : Z(e2, t2, n2, n2) ? (r2.mode = 31, -4) : (r2.havedict = 1, N) : U;
      }, r.inflateInfo = "pako inflate (from Nodeca project)";
    }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, t, r) {
      var D = e("../utils/common"), F = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], N = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], U = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], P = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
      t.exports = function(e2, t2, r2, n, i, s, a, o) {
        var h, u, l, f, c, d, p, m, _, g = o.bits, b = 0, v = 0, y = 0, w = 0, k = 0, x = 0, S = 0, z = 0, C = 0, E = 0, A = null, I = 0, O = new D.Buf16(16), B = new D.Buf16(16), R = null, T = 0;
        for (b = 0; b <= 15; b++)
          O[b] = 0;
        for (v = 0; v < n; v++)
          O[t2[r2 + v]]++;
        for (k = g, w = 15; 1 <= w && 0 === O[w]; w--)
          ;
        if (w < k && (k = w), 0 === w)
          return i[s++] = 20971520, i[s++] = 20971520, o.bits = 1, 0;
        for (y = 1; y < w && 0 === O[y]; y++)
          ;
        for (k < y && (k = y), b = z = 1; b <= 15; b++)
          if (z <<= 1, (z -= O[b]) < 0)
            return -1;
        if (0 < z && (0 === e2 || 1 !== w))
          return -1;
        for (B[1] = 0, b = 1; b < 15; b++)
          B[b + 1] = B[b] + O[b];
        for (v = 0; v < n; v++)
          0 !== t2[r2 + v] && (a[B[t2[r2 + v]]++] = v);
        if (d = 0 === e2 ? (A = R = a, 19) : 1 === e2 ? (A = F, I -= 257, R = N, T -= 257, 256) : (A = U, R = P, -1), b = y, c = s, S = v = E = 0, l = -1, f = (C = 1 << (x = k)) - 1, 1 === e2 && 852 < C || 2 === e2 && 592 < C)
          return 1;
        for (; ; ) {
          for (p = b - S, _ = a[v] < d ? (m = 0, a[v]) : a[v] > d ? (m = R[T + a[v]], A[I + a[v]]) : (m = 96, 0), h = 1 << b - S, y = u = 1 << x; i[c + (E >> S) + (u -= h)] = p << 24 | m << 16 | _ | 0, 0 !== u; )
            ;
          for (h = 1 << b - 1; E & h; )
            h >>= 1;
          if (0 !== h ? (E &= h - 1, E += h) : E = 0, v++, 0 == --O[b]) {
            if (b === w)
              break;
            b = t2[r2 + a[v]];
          }
          if (k < b && (E & f) !== l) {
            for (0 === S && (S = k), c += y, z = 1 << (x = b - S); x + S < w && !((z -= O[x + S]) <= 0); )
              x++, z <<= 1;
            if (C += 1 << x, 1 === e2 && 852 < C || 2 === e2 && 592 < C)
              return 1;
            i[l = E & f] = k << 24 | x << 16 | c - s | 0;
          }
        }
        return 0 !== E && (i[c + E] = b - S << 24 | 64 << 16 | 0), o.bits = k, 0;
      };
    }, { "../utils/common": 41 }], 51: [function(e, t, r) {
      t.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
    }, {}], 52: [function(e, t, r) {
      var i = e("../utils/common"), o = 0, h = 1;
      function n(e2) {
        for (var t2 = e2.length; 0 <= --t2; )
          e2[t2] = 0;
      }
      var s = 0, a = 29, u = 256, l = u + 1 + a, f = 30, c = 19, _ = 2 * l + 1, g = 15, d = 16, p = 7, m = 256, b = 16, v = 17, y = 18, w = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], k = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], S = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], z = new Array(2 * (l + 2));
      n(z);
      var C = new Array(2 * f);
      n(C);
      var E = new Array(512);
      n(E);
      var A = new Array(256);
      n(A);
      var I = new Array(a);
      n(I);
      var O, B, R, T = new Array(f);
      function D(e2, t2, r2, n2, i2) {
        this.static_tree = e2, this.extra_bits = t2, this.extra_base = r2, this.elems = n2, this.max_length = i2, this.has_stree = e2 && e2.length;
      }
      function F(e2, t2) {
        this.dyn_tree = e2, this.max_code = 0, this.stat_desc = t2;
      }
      function N(e2) {
        return e2 < 256 ? E[e2] : E[256 + (e2 >>> 7)];
      }
      function U(e2, t2) {
        e2.pending_buf[e2.pending++] = 255 & t2, e2.pending_buf[e2.pending++] = t2 >>> 8 & 255;
      }
      function P(e2, t2, r2) {
        e2.bi_valid > d - r2 ? (e2.bi_buf |= t2 << e2.bi_valid & 65535, U(e2, e2.bi_buf), e2.bi_buf = t2 >> d - e2.bi_valid, e2.bi_valid += r2 - d) : (e2.bi_buf |= t2 << e2.bi_valid & 65535, e2.bi_valid += r2);
      }
      function L(e2, t2, r2) {
        P(e2, r2[2 * t2], r2[2 * t2 + 1]);
      }
      function j(e2, t2) {
        for (var r2 = 0; r2 |= 1 & e2, e2 >>>= 1, r2 <<= 1, 0 < --t2; )
          ;
        return r2 >>> 1;
      }
      function Z(e2, t2, r2) {
        var n2, i2, s2 = new Array(g + 1), a2 = 0;
        for (n2 = 1; n2 <= g; n2++)
          s2[n2] = a2 = a2 + r2[n2 - 1] << 1;
        for (i2 = 0; i2 <= t2; i2++) {
          var o2 = e2[2 * i2 + 1];
          0 !== o2 && (e2[2 * i2] = j(s2[o2]++, o2));
        }
      }
      function W(e2) {
        var t2;
        for (t2 = 0; t2 < l; t2++)
          e2.dyn_ltree[2 * t2] = 0;
        for (t2 = 0; t2 < f; t2++)
          e2.dyn_dtree[2 * t2] = 0;
        for (t2 = 0; t2 < c; t2++)
          e2.bl_tree[2 * t2] = 0;
        e2.dyn_ltree[2 * m] = 1, e2.opt_len = e2.static_len = 0, e2.last_lit = e2.matches = 0;
      }
      function M(e2) {
        8 < e2.bi_valid ? U(e2, e2.bi_buf) : 0 < e2.bi_valid && (e2.pending_buf[e2.pending++] = e2.bi_buf), e2.bi_buf = 0, e2.bi_valid = 0;
      }
      function H(e2, t2, r2, n2) {
        var i2 = 2 * t2, s2 = 2 * r2;
        return e2[i2] < e2[s2] || e2[i2] === e2[s2] && n2[t2] <= n2[r2];
      }
      function G(e2, t2, r2) {
        for (var n2 = e2.heap[r2], i2 = r2 << 1; i2 <= e2.heap_len && (i2 < e2.heap_len && H(t2, e2.heap[i2 + 1], e2.heap[i2], e2.depth) && i2++, !H(t2, n2, e2.heap[i2], e2.depth)); )
          e2.heap[r2] = e2.heap[i2], r2 = i2, i2 <<= 1;
        e2.heap[r2] = n2;
      }
      function K(e2, t2, r2) {
        var n2, i2, s2, a2, o2 = 0;
        if (0 !== e2.last_lit)
          for (; n2 = e2.pending_buf[e2.d_buf + 2 * o2] << 8 | e2.pending_buf[e2.d_buf + 2 * o2 + 1], i2 = e2.pending_buf[e2.l_buf + o2], o2++, 0 === n2 ? L(e2, i2, t2) : (L(e2, (s2 = A[i2]) + u + 1, t2), 0 !== (a2 = w[s2]) && P(e2, i2 -= I[s2], a2), L(e2, s2 = N(--n2), r2), 0 !== (a2 = k[s2]) && P(e2, n2 -= T[s2], a2)), o2 < e2.last_lit; )
            ;
        L(e2, m, t2);
      }
      function Y(e2, t2) {
        var r2, n2, i2, s2 = t2.dyn_tree, a2 = t2.stat_desc.static_tree, o2 = t2.stat_desc.has_stree, h2 = t2.stat_desc.elems, u2 = -1;
        for (e2.heap_len = 0, e2.heap_max = _, r2 = 0; r2 < h2; r2++)
          0 !== s2[2 * r2] ? (e2.heap[++e2.heap_len] = u2 = r2, e2.depth[r2] = 0) : s2[2 * r2 + 1] = 0;
        for (; e2.heap_len < 2; )
          s2[2 * (i2 = e2.heap[++e2.heap_len] = u2 < 2 ? ++u2 : 0)] = 1, e2.depth[i2] = 0, e2.opt_len--, o2 && (e2.static_len -= a2[2 * i2 + 1]);
        for (t2.max_code = u2, r2 = e2.heap_len >> 1; 1 <= r2; r2--)
          G(e2, s2, r2);
        for (i2 = h2; r2 = e2.heap[1], e2.heap[1] = e2.heap[e2.heap_len--], G(e2, s2, 1), n2 = e2.heap[1], e2.heap[--e2.heap_max] = r2, e2.heap[--e2.heap_max] = n2, s2[2 * i2] = s2[2 * r2] + s2[2 * n2], e2.depth[i2] = (e2.depth[r2] >= e2.depth[n2] ? e2.depth[r2] : e2.depth[n2]) + 1, s2[2 * r2 + 1] = s2[2 * n2 + 1] = i2, e2.heap[1] = i2++, G(e2, s2, 1), 2 <= e2.heap_len; )
          ;
        e2.heap[--e2.heap_max] = e2.heap[1], function(e3, t3) {
          var r3, n3, i3, s3, a3, o3, h3 = t3.dyn_tree, u3 = t3.max_code, l2 = t3.stat_desc.static_tree, f2 = t3.stat_desc.has_stree, c2 = t3.stat_desc.extra_bits, d2 = t3.stat_desc.extra_base, p2 = t3.stat_desc.max_length, m2 = 0;
          for (s3 = 0; s3 <= g; s3++)
            e3.bl_count[s3] = 0;
          for (h3[2 * e3.heap[e3.heap_max] + 1] = 0, r3 = e3.heap_max + 1; r3 < _; r3++)
            p2 < (s3 = h3[2 * h3[2 * (n3 = e3.heap[r3]) + 1] + 1] + 1) && (s3 = p2, m2++), h3[2 * n3 + 1] = s3, u3 < n3 || (e3.bl_count[s3]++, a3 = 0, d2 <= n3 && (a3 = c2[n3 - d2]), o3 = h3[2 * n3], e3.opt_len += o3 * (s3 + a3), f2 && (e3.static_len += o3 * (l2[2 * n3 + 1] + a3)));
          if (0 !== m2) {
            do {
              for (s3 = p2 - 1; 0 === e3.bl_count[s3]; )
                s3--;
              e3.bl_count[s3]--, e3.bl_count[s3 + 1] += 2, e3.bl_count[p2]--, m2 -= 2;
            } while (0 < m2);
            for (s3 = p2; 0 !== s3; s3--)
              for (n3 = e3.bl_count[s3]; 0 !== n3; )
                u3 < (i3 = e3.heap[--r3]) || (h3[2 * i3 + 1] !== s3 && (e3.opt_len += (s3 - h3[2 * i3 + 1]) * h3[2 * i3], h3[2 * i3 + 1] = s3), n3--);
          }
        }(e2, t2), Z(s2, u2, e2.bl_count);
      }
      function X(e2, t2, r2) {
        var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h2 = 7, u2 = 4;
        for (0 === a2 && (h2 = 138, u2 = 3), t2[2 * (r2 + 1) + 1] = 65535, n2 = 0; n2 <= r2; n2++)
          i2 = a2, a2 = t2[2 * (n2 + 1) + 1], ++o2 < h2 && i2 === a2 || (o2 < u2 ? e2.bl_tree[2 * i2] += o2 : 0 !== i2 ? (i2 !== s2 && e2.bl_tree[2 * i2]++, e2.bl_tree[2 * b]++) : o2 <= 10 ? e2.bl_tree[2 * v]++ : e2.bl_tree[2 * y]++, s2 = i2, u2 = (o2 = 0) === a2 ? (h2 = 138, 3) : i2 === a2 ? (h2 = 6, 3) : (h2 = 7, 4));
      }
      function V(e2, t2, r2) {
        var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h2 = 7, u2 = 4;
        for (0 === a2 && (h2 = 138, u2 = 3), n2 = 0; n2 <= r2; n2++)
          if (i2 = a2, a2 = t2[2 * (n2 + 1) + 1], !(++o2 < h2 && i2 === a2)) {
            if (o2 < u2)
              for (; L(e2, i2, e2.bl_tree), 0 != --o2; )
                ;
            else
              0 !== i2 ? (i2 !== s2 && (L(e2, i2, e2.bl_tree), o2--), L(e2, b, e2.bl_tree), P(e2, o2 - 3, 2)) : o2 <= 10 ? (L(e2, v, e2.bl_tree), P(e2, o2 - 3, 3)) : (L(e2, y, e2.bl_tree), P(e2, o2 - 11, 7));
            s2 = i2, u2 = (o2 = 0) === a2 ? (h2 = 138, 3) : i2 === a2 ? (h2 = 6, 3) : (h2 = 7, 4);
          }
      }
      n(T);
      var q = false;
      function J(e2, t2, r2, n2) {
        P(e2, (s << 1) + (n2 ? 1 : 0), 3), function(e3, t3, r3, n3) {
          M(e3), n3 && (U(e3, r3), U(e3, ~r3)), i.arraySet(e3.pending_buf, e3.window, t3, r3, e3.pending), e3.pending += r3;
        }(e2, t2, r2, true);
      }
      r._tr_init = function(e2) {
        q || (function() {
          var e3, t2, r2, n2, i2, s2 = new Array(g + 1);
          for (n2 = r2 = 0; n2 < a - 1; n2++)
            for (I[n2] = r2, e3 = 0; e3 < 1 << w[n2]; e3++)
              A[r2++] = n2;
          for (A[r2 - 1] = n2, n2 = i2 = 0; n2 < 16; n2++)
            for (T[n2] = i2, e3 = 0; e3 < 1 << k[n2]; e3++)
              E[i2++] = n2;
          for (i2 >>= 7; n2 < f; n2++)
            for (T[n2] = i2 << 7, e3 = 0; e3 < 1 << k[n2] - 7; e3++)
              E[256 + i2++] = n2;
          for (t2 = 0; t2 <= g; t2++)
            s2[t2] = 0;
          for (e3 = 0; e3 <= 143; )
            z[2 * e3 + 1] = 8, e3++, s2[8]++;
          for (; e3 <= 255; )
            z[2 * e3 + 1] = 9, e3++, s2[9]++;
          for (; e3 <= 279; )
            z[2 * e3 + 1] = 7, e3++, s2[7]++;
          for (; e3 <= 287; )
            z[2 * e3 + 1] = 8, e3++, s2[8]++;
          for (Z(z, l + 1, s2), e3 = 0; e3 < f; e3++)
            C[2 * e3 + 1] = 5, C[2 * e3] = j(e3, 5);
          O = new D(z, w, u + 1, l, g), B = new D(C, k, 0, f, g), R = new D(new Array(0), x, 0, c, p);
        }(), q = true), e2.l_desc = new F(e2.dyn_ltree, O), e2.d_desc = new F(e2.dyn_dtree, B), e2.bl_desc = new F(e2.bl_tree, R), e2.bi_buf = 0, e2.bi_valid = 0, W(e2);
      }, r._tr_stored_block = J, r._tr_flush_block = function(e2, t2, r2, n2) {
        var i2, s2, a2 = 0;
        0 < e2.level ? (2 === e2.strm.data_type && (e2.strm.data_type = function(e3) {
          var t3, r3 = 4093624447;
          for (t3 = 0; t3 <= 31; t3++, r3 >>>= 1)
            if (1 & r3 && 0 !== e3.dyn_ltree[2 * t3])
              return o;
          if (0 !== e3.dyn_ltree[18] || 0 !== e3.dyn_ltree[20] || 0 !== e3.dyn_ltree[26])
            return h;
          for (t3 = 32; t3 < u; t3++)
            if (0 !== e3.dyn_ltree[2 * t3])
              return h;
          return o;
        }(e2)), Y(e2, e2.l_desc), Y(e2, e2.d_desc), a2 = function(e3) {
          var t3;
          for (X(e3, e3.dyn_ltree, e3.l_desc.max_code), X(e3, e3.dyn_dtree, e3.d_desc.max_code), Y(e3, e3.bl_desc), t3 = c - 1; 3 <= t3 && 0 === e3.bl_tree[2 * S[t3] + 1]; t3--)
            ;
          return e3.opt_len += 3 * (t3 + 1) + 5 + 5 + 4, t3;
        }(e2), i2 = e2.opt_len + 3 + 7 >>> 3, (s2 = e2.static_len + 3 + 7 >>> 3) <= i2 && (i2 = s2)) : i2 = s2 = r2 + 5, r2 + 4 <= i2 && -1 !== t2 ? J(e2, t2, r2, n2) : 4 === e2.strategy || s2 === i2 ? (P(e2, 2 + (n2 ? 1 : 0), 3), K(e2, z, C)) : (P(e2, 4 + (n2 ? 1 : 0), 3), function(e3, t3, r3, n3) {
          var i3;
          for (P(e3, t3 - 257, 5), P(e3, r3 - 1, 5), P(e3, n3 - 4, 4), i3 = 0; i3 < n3; i3++)
            P(e3, e3.bl_tree[2 * S[i3] + 1], 3);
          V(e3, e3.dyn_ltree, t3 - 1), V(e3, e3.dyn_dtree, r3 - 1);
        }(e2, e2.l_desc.max_code + 1, e2.d_desc.max_code + 1, a2 + 1), K(e2, e2.dyn_ltree, e2.dyn_dtree)), W(e2), n2 && M(e2);
      }, r._tr_tally = function(e2, t2, r2) {
        return e2.pending_buf[e2.d_buf + 2 * e2.last_lit] = t2 >>> 8 & 255, e2.pending_buf[e2.d_buf + 2 * e2.last_lit + 1] = 255 & t2, e2.pending_buf[e2.l_buf + e2.last_lit] = 255 & r2, e2.last_lit++, 0 === t2 ? e2.dyn_ltree[2 * r2]++ : (e2.matches++, t2--, e2.dyn_ltree[2 * (A[r2] + u + 1)]++, e2.dyn_dtree[2 * N(t2)]++), e2.last_lit === e2.lit_bufsize - 1;
      }, r._tr_align = function(e2) {
        P(e2, 2, 3), L(e2, m, z), function(e3) {
          16 === e3.bi_valid ? (U(e3, e3.bi_buf), e3.bi_buf = 0, e3.bi_valid = 0) : 8 <= e3.bi_valid && (e3.pending_buf[e3.pending++] = 255 & e3.bi_buf, e3.bi_buf >>= 8, e3.bi_valid -= 8);
        }(e2);
      };
    }, { "../utils/common": 41 }], 53: [function(e, t, r) {
      t.exports = function() {
        this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
      };
    }, {}], 54: [function(e, t, r) {
      (function(e2) {
        !function(r2, n) {
          if (!r2.setImmediate) {
            var i, s, t2, a, o = 1, h = {}, u = false, l = r2.document, e3 = Object.getPrototypeOf && Object.getPrototypeOf(r2);
            e3 = e3 && e3.setTimeout ? e3 : r2, i = "[object process]" === {}.toString.call(r2.process) ? function(e4) {
              process.nextTick(function() {
                c(e4);
              });
            } : function() {
              if (r2.postMessage && !r2.importScripts) {
                var e4 = true, t3 = r2.onmessage;
                return r2.onmessage = function() {
                  e4 = false;
                }, r2.postMessage("", "*"), r2.onmessage = t3, e4;
              }
            }() ? (a = "setImmediate$" + Math.random() + "$", r2.addEventListener ? r2.addEventListener("message", d, false) : r2.attachEvent("onmessage", d), function(e4) {
              r2.postMessage(a + e4, "*");
            }) : r2.MessageChannel ? ((t2 = new MessageChannel()).port1.onmessage = function(e4) {
              c(e4.data);
            }, function(e4) {
              t2.port2.postMessage(e4);
            }) : l && "onreadystatechange" in l.createElement("script") ? (s = l.documentElement, function(e4) {
              var t3 = l.createElement("script");
              t3.onreadystatechange = function() {
                c(e4), t3.onreadystatechange = null, s.removeChild(t3), t3 = null;
              }, s.appendChild(t3);
            }) : function(e4) {
              setTimeout(c, 0, e4);
            }, e3.setImmediate = function(e4) {
              "function" != typeof e4 && (e4 = new Function("" + e4));
              for (var t3 = new Array(arguments.length - 1), r3 = 0; r3 < t3.length; r3++)
                t3[r3] = arguments[r3 + 1];
              var n2 = { callback: e4, args: t3 };
              return h[o] = n2, i(o), o++;
            }, e3.clearImmediate = f;
          }
          function f(e4) {
            delete h[e4];
          }
          function c(e4) {
            if (u)
              setTimeout(c, 0, e4);
            else {
              var t3 = h[e4];
              if (t3) {
                u = true;
                try {
                  !function(e5) {
                    var t4 = e5.callback, r3 = e5.args;
                    switch (r3.length) {
                      case 0:
                        t4();
                        break;
                      case 1:
                        t4(r3[0]);
                        break;
                      case 2:
                        t4(r3[0], r3[1]);
                        break;
                      case 3:
                        t4(r3[0], r3[1], r3[2]);
                        break;
                      default:
                        t4.apply(n, r3);
                    }
                  }(t3);
                } finally {
                  f(e4), u = false;
                }
              }
            }
          }
          function d(e4) {
            e4.source === r2 && "string" == typeof e4.data && 0 === e4.data.indexOf(a) && c(+e4.data.slice(a.length));
          }
        }("undefined" == typeof self ? void 0 === e2 ? this : e2 : self);
      }).call(this, "undefined" != typeof commonjsGlobal ? commonjsGlobal : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}] }, {}, [10])(10);
  });
})(jszip_min);
class Logger {
  static log(message, data) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage, data || "");
    this.logs.push(data ? `${logMessage} ${JSON.stringify(data, null, 2)}` : logMessage);
  }
  static error(message, error) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const errorMessage = `[${timestamp}] ERROR: ${message}`;
    console.error(errorMessage, error);
    this.logs.push(`${errorMessage} ${(error == null ? void 0 : error.message) || error}`);
    if (error == null ? void 0 : error.stack) {
      this.logs.push(`Stack trace: ${error.stack}`);
    }
  }
  static getLogs() {
    return this.logs;
  }
  static clear() {
    this.logs = [];
  }
}
Logger.logs = [];
class CustomNetlifyClient {
  constructor(token) {
    this.token = token;
    Logger.log("Initializing Netlify client");
  }
  async getCurrentUser() {
    try {
      Logger.log("Getting current user");
      const response = await obsidian.requestUrl({
        url: "https://api.netlify.com/api/v1/user",
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json"
        }
      });
      Logger.log("Got user response", response.json);
      return response.json;
    } catch (error) {
      Logger.error("Failed to get current user", error);
      throw error;
    }
  }
  async createSite(options) {
    try {
      Logger.log("Creating new site", options);
      const response = await obsidian.requestUrl({
        url: "https://api.netlify.com/api/v1/sites",
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: options.name,
          account_slug: options.account_slug
        })
      });
      Logger.log("Site creation response", response.json);
      return response.json;
    } catch (error) {
      Logger.error("Failed to create site", error);
      throw error;
    }
  }
  async deploy(siteId, files, options) {
    try {
      Logger.log(`Starting deployment to site ${siteId}`, { fileCount: files.length, options });
      const fileMap = {};
      for (const file of files) {
        try {
          let content = file.content;
          if (content instanceof ArrayBuffer) {
            content = Buffer.from(content).toString("base64");
          }
          const relativePath = file.path.replace(/^\/+/, "").replace(/\\/g, "/");
          Logger.log(`Adding file to deployment: ${relativePath}`);
          fileMap[relativePath] = content;
        } catch (error) {
          Logger.error(`Failed to process file ${file.path}`, error);
        }
      }
      if (Object.keys(fileMap).length === 0) {
        throw new Error("No files to deploy");
      }
      Logger.log("Prepared files for deployment", { paths: Object.keys(fileMap) });
      const deployResponse = await obsidian.requestUrl({
        url: `https://api.netlify.com/api/v1/sites/${siteId}/deploys`,
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          files: fileMap,
          draft: options.draft,
          title: options.title,
          async: true
          // Enable async deployment
        })
      });
      Logger.log("Initial deploy response", deployResponse.json);
      const deployId = deployResponse.json.id;
      let deployStatus = await this.waitForDeploy(deployId, 60);
      if (deployStatus.state === "error") {
        throw new Error(`Deploy failed with state: ${deployStatus.state}`);
      }
      if (deployStatus.required) {
        Logger.log("Uploading required files", deployStatus.required);
        for (const filePath of Object.keys(fileMap)) {
          const fileContent = fileMap[filePath];
          try {
            await obsidian.requestUrl({
              url: `https://api.netlify.com/api/v1/deploys/${deployId}/files/${encodeURIComponent(filePath)}`,
              method: "PUT",
              headers: {
                "Authorization": `Bearer ${this.token}`,
                "Content-Type": "application/octet-stream"
              },
              body: fileContent
            });
            Logger.log(`Successfully uploaded file: ${filePath}`);
          } catch (error) {
            Logger.error(`Failed to upload file ${filePath}`, error);
          }
        }
      }
      deployStatus = await this.waitForDeploy(deployId, 60);
      if (deployStatus.state !== "ready") {
        throw new Error(`Deploy failed with state: ${deployStatus.state}`);
      }
      return deployResponse.json;
    } catch (error) {
      Logger.error("Failed to deploy site", error);
      throw error;
    }
  }
  async waitForDeploy(deployId, maxAttempts = 60) {
    Logger.log(`Waiting for deploy ${deployId} to complete`);
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await obsidian.requestUrl({
          url: `https://api.netlify.com/api/v1/deploys/${deployId}`,
          method: "GET",
          headers: {
            "Authorization": `Bearer ${this.token}`
          }
        });
        const deploy = response.json;
        Logger.log(`Deploy status (attempt ${i + 1})`, deploy);
        if (deploy.state === "ready" || deploy.state === "error" || deploy.state === "published" || deploy.state === "failed") {
          return deploy;
        }
        if (deploy.state === "prepared" && i > 20) {
          Logger.log("Deployment has been in prepared state for a long time, considering it ready");
          return deploy;
        }
        if (deploy.state === "uploading" && i > 30) {
          Logger.log("Deployment has been in uploading state for a long time, considering it ready");
          return deploy;
        }
        await new Promise((resolve) => setTimeout(resolve, 2e3));
      } catch (error) {
        Logger.error(`Failed to check deploy status (attempt ${i + 1})`, error);
      }
    }
    throw new Error("Deploy timed out");
  }
}
class NetlifyService {
  constructor(settings, app, saveSettings) {
    this.app = app;
    this.token = settings.netlifyToken || "";
    this.siteId = settings.siteId || "";
    this.siteName = settings.siteName || "";
    this.useCustomDomain = settings.useCustomDomain || false;
    this.customDomain = settings.customDomain || "";
    this.netlifyClient = null;
    this.saveSettings = saveSettings;
    if (this.token) {
      this.initNetlifyClient();
    }
  }
  /**
   * Initialize the Netlify client
   */
  initNetlifyClient() {
    try {
      this.netlifyClient = new CustomNetlifyClient(this.token);
    } catch (error) {
      console.error("Failed to initialize Netlify client:", error);
      this.netlifyClient = null;
      new obsidian.Notice("Failed to initialize Netlify client. Please check your token.");
    }
  }
  /**
   * Validate the Netlify API token
   */
  async validateToken(token) {
    try {
      const tempClient = new CustomNetlifyClient(token);
      const user = await tempClient.getCurrentUser();
      return !!user.id;
    } catch (error) {
      console.error("Failed to validate Netlify token:", error);
      return false;
    }
  }
  /**
   * Create a new Netlify site if one doesn't exist yet
   */
  async createSiteIfNeeded() {
    try {
      if (this.siteId) {
        try {
          const response = await obsidian.requestUrl({
            url: `https://api.netlify.com/api/v1/sites/${this.siteId}`,
            method: "GET",
            headers: {
              "Authorization": `Bearer ${this.token}`
            }
          });
          return this.siteId;
        } catch (error) {
          Logger.log("Site ID not found, creating new site");
        }
      }
      if (!this.netlifyClient) {
        this.initNetlifyClient();
        if (!this.netlifyClient) {
          throw new Error("Failed to initialize Netlify client");
        }
      }
      let siteName = this.siteName || `obsidian-slides-${Date.now()}`;
      siteName = siteName.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 63);
      Logger.log("Creating new site with sanitized name:", siteName);
      const site = await this.netlifyClient.createSite({
        name: siteName,
        account_slug: null
        // Use the user's default account
      });
      Logger.log("Created new site:", site);
      this.siteId = site.id;
      if (!this.siteName) {
        this.siteName = siteName;
      }
      await this.saveSettings({
        netlifyToken: this.token,
        siteId: site.id,
        siteName: this.siteName,
        useCustomDomain: this.useCustomDomain,
        customDomain: this.customDomain
      });
      return this.siteId;
    } catch (error) {
      Logger.error("Failed to create Netlify site", error);
      throw new Error("Failed to create Netlify site. Please check your token and try again.");
    }
  }
  /**
   * Deploy slides to Netlify
   */
  async deployToNetlify(exportPath, deploymentName) {
    try {
      Logger.log("Starting deployment process...");
      Logger.log("Export path:", exportPath);
      Logger.log("Deployment name:", deploymentName);
      const siteId = await this.createSiteIfNeeded();
      Logger.log("Using site ID:", siteId);
      const files = await this.getFilesFromExportPath(exportPath);
      Logger.log("Found files to deploy:", files);
      if (files.length === 0) {
        throw new Error("No files found to deploy. Please ensure the slides were exported correctly.");
      }
      const fileContents = await Promise.all(
        files.map(async (file) => {
          const content = await this.readFile(file.path);
          return {
            path: file.name,
            // Use the relative path name
            content
          };
        })
      );
      if (!this.netlifyClient) {
        this.initNetlifyClient();
        if (!this.netlifyClient) {
          throw new Error("Failed to initialize Netlify client");
        }
      }
      Logger.log("Starting Netlify deployment...");
      const deployment = await this.netlifyClient.deploy(siteId, fileContents, {
        title: deploymentName || this.siteName,
        draft: false
      });
      const deploymentInfo = {
        id: deployment.id,
        url: deployment.deploy_ssl_url || deployment.deploy_url,
        site_id: deployment.site_id,
        deploy_id: deployment.id,
        name: deploymentName,
        state: deployment.state
      };
      Logger.log("Deployment completed:", deploymentInfo);
      return deploymentInfo;
    } catch (error) {
      Logger.error("Deployment failed:", error);
      throw new Error(`Deployment failed: ${error.message}`);
    }
  }
  /**
   * Get files from export path - recursively gets all files
   */
  async getFilesFromExportPath(exportPath) {
    try {
      Logger.log("Looking for files in export path:", exportPath);
      const exists = await this.app.vault.adapter.exists(exportPath);
      if (!exists) {
        Logger.error("Export directory does not exist", exportPath);
        throw new Error("Export directory does not exist");
      }
      try {
        const manifestContent = await this.app.vault.adapter.read(`${exportPath}/manifest.json`);
        const manifest = JSON.parse(manifestContent);
        Logger.log("Found manifest file:", manifest);
        return manifest.files.map((fileName) => ({
          path: `${exportPath}/${fileName}`,
          name: fileName
        }));
      } catch (manifestError) {
        Logger.log("No manifest file found, scanning directory");
        const listing = await this.app.vault.adapter.list(exportPath);
        Logger.log("Directory listing:", listing);
        const results = [];
        for (const filePath of listing.files) {
          const relativePath = filePath.startsWith(exportPath) ? filePath.substring(exportPath.length).replace(/^\/+/, "") : filePath;
          const name = filePath.split("/").pop() || "";
          results.push({ path: filePath, name: relativePath });
        }
        return results;
      }
    } catch (error) {
      Logger.error("Error reading files from export path", error);
      throw new Error(`Failed to read exported files: ${error.message}`);
    }
  }
  /**
   * Read file content using Obsidian's adapter
   */
  async readFile(path) {
    try {
      return await this.app.vault.adapter.read(path);
    } catch (error) {
      Logger.error(`Error reading file ${path}`, error);
      throw new Error(`Failed to read file ${path}: ${error.message}`);
    }
  }
  /**
   * Get deployment logs
   */
  getDeploymentLogs() {
    return Logger.getLogs();
  }
  /**
   * Clear deployment logs
   */
  clearDeploymentLogs() {
    Logger.clear();
  }
}
const Settings_svelte_svelte_type_style_lang = "";
function get_each_context_2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[35] = list[i];
  return child_ctx;
}
function get_each_context_3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[29] = list[i];
  return child_ctx;
}
function get_each_context_4(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[32] = list[i];
  return child_ctx;
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[29] = list[i];
  return child_ctx;
}
function get_each_context_1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[32] = list[i];
  return child_ctx;
}
function create_else_block$1(ctx) {
  let div18;
  let h2;
  let t1;
  let div3;
  let h30;
  let t3;
  let div2;
  let div0;
  let t5;
  let div1;
  let input0;
  let t6;
  let button0;
  let t7_value = (
    /*isValidatingToken*/
    ctx[2] ? "Validating..." : "Validate"
  );
  let t7;
  let t8;
  let t9;
  let div16;
  let h31;
  let t11;
  let div8;
  let div4;
  let t13;
  let div7;
  let div5;
  let input1;
  let t14;
  let button1;
  let t15_value = (
    /*isGeneratingNames*/
    ctx[7] ? "Generating..." : "Generate"
  );
  let t15;
  let t16;
  let t17;
  let div6;
  let p;
  let t19;
  let code;
  let t20;
  let t21_value = (
    /*settings*/
    (ctx[0].siteName || "your-site-name") + ""
  );
  let t21;
  let t22;
  let t23;
  let div11;
  let div9;
  let t25;
  let div10;
  let select;
  let t26;
  let div15;
  let div12;
  let t28;
  let div14;
  let div13;
  let input2;
  let t29;
  let label4;
  let t30;
  let t31;
  let t32;
  let div17;
  let button2;
  let mounted;
  let dispose;
  let if_block0 = (
    /*validationMessage*/
    ctx[4] && create_if_block_7(ctx)
  );
  let if_block1 = (
    /*generatedNames*/
    ctx[6].length > 0 && create_if_block_6(ctx)
  );
  let each_value_3 = (
    /*themes*/
    ctx[9]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value_3.length; i += 1) {
    each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
  }
  let if_block2 = (
    /*settings*/
    ctx[0].useCustomDomain && create_if_block_5$1(ctx)
  );
  let if_block3 = (
    /*deploymentHistory*/
    ctx[8].length > 0 && create_if_block_4$2(ctx)
  );
  return {
    c() {
      div18 = element("div");
      h2 = element("h2");
      h2.textContent = "Netlify Deployment Settings";
      t1 = space();
      div3 = element("div");
      h30 = element("h3");
      h30.textContent = "Authentication";
      t3 = space();
      div2 = element("div");
      div0 = element("div");
      div0.innerHTML = `<label for="netlify-token">Netlify Personal Access Token:</label>`;
      t5 = space();
      div1 = element("div");
      input0 = element("input");
      t6 = space();
      button0 = element("button");
      t7 = text(t7_value);
      t8 = space();
      if (if_block0)
        if_block0.c();
      t9 = space();
      div16 = element("div");
      h31 = element("h3");
      h31.textContent = "Site Configuration";
      t11 = space();
      div8 = element("div");
      div4 = element("div");
      div4.innerHTML = `<label for="site-name">Site Name:</label>`;
      t13 = space();
      div7 = element("div");
      div5 = element("div");
      input1 = element("input");
      t14 = space();
      button1 = element("button");
      t15 = text(t15_value);
      t16 = space();
      if (if_block1)
        if_block1.c();
      t17 = space();
      div6 = element("div");
      p = element("p");
      p.textContent = "Your site will be available at:";
      t19 = space();
      code = element("code");
      t20 = text("https://");
      t21 = text(t21_value);
      t22 = text(".netlify.app");
      t23 = space();
      div11 = element("div");
      div9 = element("div");
      div9.innerHTML = `<label for="deployment-theme">Theme:</label>`;
      t25 = space();
      div10 = element("div");
      select = element("select");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t26 = space();
      div15 = element("div");
      div12 = element("div");
      div12.innerHTML = `<label for="use-custom-domain">Use Custom Domain:</label>`;
      t28 = space();
      div14 = element("div");
      div13 = element("div");
      input2 = element("input");
      t29 = space();
      label4 = element("label");
      t30 = space();
      if (if_block2)
        if_block2.c();
      t31 = space();
      if (if_block3)
        if_block3.c();
      t32 = space();
      div17 = element("div");
      button2 = element("button");
      button2.textContent = "Restart Setup Wizard";
      attr(h2, "class", "svelte-9aypa6");
      attr(h30, "class", "svelte-9aypa6");
      attr(div0, "class", "setting-label svelte-9aypa6");
      attr(input0, "type", "password");
      attr(input0, "id", "netlify-token");
      attr(input0, "placeholder", "Your Netlify token");
      attr(input0, "class", "svelte-9aypa6");
      attr(button0, "class", "validate-button svelte-9aypa6");
      attr(div1, "class", "setting-control token-input svelte-9aypa6");
      attr(div2, "class", "setting-item svelte-9aypa6");
      attr(div3, "class", "setting-section");
      attr(h31, "class", "svelte-9aypa6");
      attr(div4, "class", "setting-label svelte-9aypa6");
      attr(input1, "type", "text");
      attr(input1, "id", "site-name");
      attr(input1, "placeholder", "my-awesome-slides");
      attr(input1, "class", "svelte-9aypa6");
      attr(button1, "class", "site-name-generator-button svelte-9aypa6");
      attr(div5, "class", "site-name-input svelte-9aypa6");
      attr(div6, "class", "site-preview svelte-9aypa6");
      attr(div7, "class", "setting-control svelte-9aypa6");
      attr(div8, "class", "setting-item svelte-9aypa6");
      attr(div9, "class", "setting-label svelte-9aypa6");
      attr(select, "id", "deployment-theme");
      attr(select, "class", "svelte-9aypa6");
      if (
        /*settings*/
        ctx[0].deploymentTheme === void 0
      )
        add_render_callback(() => (
          /*select_change_handler_1*/
          ctx[25].call(select)
        ));
      attr(div10, "class", "setting-control svelte-9aypa6");
      attr(div11, "class", "setting-item svelte-9aypa6");
      attr(div12, "class", "setting-label svelte-9aypa6");
      attr(input2, "type", "checkbox");
      attr(input2, "id", "use-custom-domain");
      attr(input2, "class", "svelte-9aypa6");
      attr(label4, "class", "toggle svelte-9aypa6");
      attr(label4, "for", "use-custom-domain");
      attr(div13, "class", "toggle-container svelte-9aypa6");
      attr(div14, "class", "setting-control svelte-9aypa6");
      attr(div15, "class", "setting-item svelte-9aypa6");
      attr(div16, "class", "setting-section");
      attr(button2, "class", "reset-button svelte-9aypa6");
      attr(div17, "class", "setting-section");
      attr(div18, "class", "settings-container");
    },
    m(target, anchor) {
      insert(target, div18, anchor);
      append(div18, h2);
      append(div18, t1);
      append(div18, div3);
      append(div3, h30);
      append(div3, t3);
      append(div3, div2);
      append(div2, div0);
      append(div2, t5);
      append(div2, div1);
      append(div1, input0);
      set_input_value(
        input0,
        /*settings*/
        ctx[0].netlifyToken
      );
      append(div1, t6);
      append(div1, button0);
      append(button0, t7);
      append(div2, t8);
      if (if_block0)
        if_block0.m(div2, null);
      append(div18, t9);
      append(div18, div16);
      append(div16, h31);
      append(div16, t11);
      append(div16, div8);
      append(div8, div4);
      append(div8, t13);
      append(div8, div7);
      append(div7, div5);
      append(div5, input1);
      set_input_value(
        input1,
        /*settings*/
        ctx[0].siteName
      );
      append(div5, t14);
      append(div5, button1);
      append(button1, t15);
      append(div7, t16);
      if (if_block1)
        if_block1.m(div7, null);
      append(div7, t17);
      append(div7, div6);
      append(div6, p);
      append(div6, t19);
      append(div6, code);
      append(code, t20);
      append(code, t21);
      append(code, t22);
      append(div16, t23);
      append(div16, div11);
      append(div11, div9);
      append(div11, t25);
      append(div11, div10);
      append(div10, select);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(select, null);
        }
      }
      select_option(
        select,
        /*settings*/
        ctx[0].deploymentTheme,
        true
      );
      append(div16, t26);
      append(div16, div15);
      append(div15, div12);
      append(div15, t28);
      append(div15, div14);
      append(div14, div13);
      append(div13, input2);
      input2.checked = /*settings*/
      ctx[0].useCustomDomain;
      append(div13, t29);
      append(div13, label4);
      append(div16, t30);
      if (if_block2)
        if_block2.m(div16, null);
      append(div18, t31);
      if (if_block3)
        if_block3.m(div18, null);
      append(div18, t32);
      append(div18, div17);
      append(div17, button2);
      if (!mounted) {
        dispose = [
          listen(
            input0,
            "input",
            /*input0_input_handler_1*/
            ctx[22]
          ),
          listen(
            button0,
            "click",
            /*validateToken*/
            ctx[12]
          ),
          listen(
            input1,
            "input",
            /*input1_input_handler*/
            ctx[23]
          ),
          listen(
            input1,
            "change",
            /*handleSettingsChange*/
            ctx[14]
          ),
          listen(
            button1,
            "click",
            /*generateSiteNames*/
            ctx[10]
          ),
          listen(
            select,
            "change",
            /*select_change_handler_1*/
            ctx[25]
          ),
          listen(
            select,
            "change",
            /*handleSettingsChange*/
            ctx[14]
          ),
          listen(
            input2,
            "change",
            /*input2_change_handler*/
            ctx[26]
          ),
          listen(
            input2,
            "change",
            /*handleSettingsChange*/
            ctx[14]
          ),
          listen(
            button2,
            "click",
            /*click_handler_2*/
            ctx[28]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*settings, themes*/
      513 && input0.value !== /*settings*/
      ctx2[0].netlifyToken) {
        set_input_value(
          input0,
          /*settings*/
          ctx2[0].netlifyToken
        );
      }
      if (dirty[0] & /*isValidatingToken*/
      4 && t7_value !== (t7_value = /*isValidatingToken*/
      ctx2[2] ? "Validating..." : "Validate"))
        set_data(t7, t7_value);
      if (
        /*validationMessage*/
        ctx2[4]
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_7(ctx2);
          if_block0.c();
          if_block0.m(div2, null);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (dirty[0] & /*settings, themes*/
      513 && input1.value !== /*settings*/
      ctx2[0].siteName) {
        set_input_value(
          input1,
          /*settings*/
          ctx2[0].siteName
        );
      }
      if (dirty[0] & /*isGeneratingNames*/
      128 && t15_value !== (t15_value = /*isGeneratingNames*/
      ctx2[7] ? "Generating..." : "Generate"))
        set_data(t15, t15_value);
      if (
        /*generatedNames*/
        ctx2[6].length > 0
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block_6(ctx2);
          if_block1.c();
          if_block1.m(div7, t17);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (dirty[0] & /*settings*/
      1 && t21_value !== (t21_value = /*settings*/
      (ctx2[0].siteName || "your-site-name") + ""))
        set_data(t21, t21_value);
      if (dirty[0] & /*themes*/
      512) {
        each_value_3 = /*themes*/
        ctx2[9];
        let i;
        for (i = 0; i < each_value_3.length; i += 1) {
          const child_ctx = get_each_context_3(ctx2, each_value_3, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block_3(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(select, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value_3.length;
      }
      if (dirty[0] & /*settings, themes*/
      513) {
        select_option(
          select,
          /*settings*/
          ctx2[0].deploymentTheme
        );
      }
      if (dirty[0] & /*settings, themes*/
      513) {
        input2.checked = /*settings*/
        ctx2[0].useCustomDomain;
      }
      if (
        /*settings*/
        ctx2[0].useCustomDomain
      ) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
        } else {
          if_block2 = create_if_block_5$1(ctx2);
          if_block2.c();
          if_block2.m(div16, null);
        }
      } else if (if_block2) {
        if_block2.d(1);
        if_block2 = null;
      }
      if (
        /*deploymentHistory*/
        ctx2[8].length > 0
      )
        if_block3.p(ctx2, dirty);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div18);
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
      destroy_each(each_blocks, detaching);
      if (if_block2)
        if_block2.d();
      if (if_block3)
        if_block3.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block$2(ctx) {
  let div;
  let h2;
  let t1;
  let p;
  let t3;
  let authflow;
  let t4;
  let current;
  authflow = new AuthFlow({});
  authflow.$on(
    "tokenGenerated",
    /*tokenGenerated_handler*/
    ctx[16]
  );
  let if_block = (
    /*tokenValidated*/
    ctx[3] && create_if_block_1$2(ctx)
  );
  return {
    c() {
      div = element("div");
      h2 = element("h2");
      h2.textContent = "Setup Wizard";
      t1 = space();
      p = element("p");
      p.textContent = "Let's set up your Netlify deployment in a few simple steps!";
      t3 = space();
      create_component(authflow.$$.fragment);
      t4 = space();
      if (if_block)
        if_block.c();
      attr(h2, "class", "svelte-9aypa6");
      attr(div, "class", "setup-wizard svelte-9aypa6");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, h2);
      append(div, t1);
      append(div, p);
      append(div, t3);
      mount_component(authflow, div, null);
      append(div, t4);
      if (if_block)
        if_block.m(div, null);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*tokenValidated*/
        ctx2[3]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block_1$2(ctx2);
          if_block.c();
          if_block.m(div, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(authflow.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(authflow.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(authflow);
      if (if_block)
        if_block.d();
    }
  };
}
function create_if_block_7(ctx) {
  let p;
  let t;
  let p_class_value;
  return {
    c() {
      p = element("p");
      t = text(
        /*validationMessage*/
        ctx[4]
      );
      attr(p, "class", p_class_value = "validation-message " + /*tokenValidated*/
      (ctx[3] ? "success" : "error") + " svelte-9aypa6");
    },
    m(target, anchor) {
      insert(target, p, anchor);
      append(p, t);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*validationMessage*/
      16)
        set_data(
          t,
          /*validationMessage*/
          ctx2[4]
        );
      if (dirty[0] & /*tokenValidated*/
      8 && p_class_value !== (p_class_value = "validation-message " + /*tokenValidated*/
      (ctx2[3] ? "success" : "error") + " svelte-9aypa6")) {
        attr(p, "class", p_class_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
function create_if_block_6(ctx) {
  let div1;
  let p;
  let t1;
  let div0;
  let each_value_4 = (
    /*generatedNames*/
    ctx[6]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value_4.length; i += 1) {
    each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
  }
  return {
    c() {
      div1 = element("div");
      p = element("p");
      p.textContent = "Suggestions:";
      t1 = space();
      div0 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div0, "class", "name-suggestions svelte-9aypa6");
      attr(div1, "class", "generated-names svelte-9aypa6");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, p);
      append(div1, t1);
      append(div1, div0);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div0, null);
        }
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*selectSiteName, generatedNames*/
      2112) {
        each_value_4 = /*generatedNames*/
        ctx2[6];
        let i;
        for (i = 0; i < each_value_4.length; i += 1) {
          const child_ctx = get_each_context_4(ctx2, each_value_4, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block_4(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div0, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value_4.length;
      }
    },
    d(detaching) {
      if (detaching)
        detach(div1);
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_each_block_4(ctx) {
  let button;
  let t0_value = (
    /*name*/
    ctx[32] + ""
  );
  let t0;
  let t1;
  let mounted;
  let dispose;
  function click_handler_1() {
    return (
      /*click_handler_1*/
      ctx[24](
        /*name*/
        ctx[32]
      )
    );
  }
  return {
    c() {
      button = element("button");
      t0 = text(t0_value);
      t1 = space();
      attr(button, "class", "suggested-name svelte-9aypa6");
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, t0);
      append(button, t1);
      if (!mounted) {
        dispose = listen(button, "click", click_handler_1);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & /*generatedNames*/
      64 && t0_value !== (t0_value = /*name*/
      ctx[32] + ""))
        set_data(t0, t0_value);
    },
    d(detaching) {
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
function create_each_block_3(ctx) {
  let option;
  let t_value = (
    /*theme*/
    ctx[29].name + ""
  );
  let t;
  return {
    c() {
      option = element("option");
      t = text(t_value);
      option.__value = /*theme*/
      ctx[29].id;
      option.value = option.__value;
    },
    m(target, anchor) {
      insert(target, option, anchor);
      append(option, t);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(option);
    }
  };
}
function create_if_block_5$1(ctx) {
  let div2;
  let div0;
  let t1;
  let div1;
  let input;
  let t2;
  let p;
  let mounted;
  let dispose;
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      div0.innerHTML = `<label for="custom-domain">Custom Domain:</label>`;
      t1 = space();
      div1 = element("div");
      input = element("input");
      t2 = space();
      p = element("p");
      p.textContent = "Note: You'll need to configure DNS settings in your domain provider's dashboard";
      attr(div0, "class", "setting-label svelte-9aypa6");
      attr(input, "type", "text");
      attr(input, "id", "custom-domain");
      attr(input, "placeholder", "slides.yourdomain.com");
      attr(input, "class", "svelte-9aypa6");
      attr(div1, "class", "setting-control svelte-9aypa6");
      attr(div2, "class", "setting-item indented svelte-9aypa6");
      attr(p, "class", "info-text svelte-9aypa6");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, div0);
      append(div2, t1);
      append(div2, div1);
      append(div1, input);
      set_input_value(
        input,
        /*settings*/
        ctx[0].customDomain
      );
      insert(target, t2, anchor);
      insert(target, p, anchor);
      if (!mounted) {
        dispose = [
          listen(
            input,
            "input",
            /*input_input_handler_1*/
            ctx[27]
          ),
          listen(
            input,
            "change",
            /*handleSettingsChange*/
            ctx[14]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*settings, themes*/
      513 && input.value !== /*settings*/
      ctx2[0].customDomain) {
        set_input_value(
          input,
          /*settings*/
          ctx2[0].customDomain
        );
      }
    },
    d(detaching) {
      if (detaching)
        detach(div2);
      if (detaching)
        detach(t2);
      if (detaching)
        detach(p);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_4$2(ctx) {
  let div1;
  let h3;
  let t1;
  let div0;
  let each_value_2 = (
    /*deploymentHistory*/
    ctx[8]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value_2.length; i += 1) {
    each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
  }
  return {
    c() {
      div1 = element("div");
      h3 = element("h3");
      h3.textContent = "Deployment History";
      t1 = space();
      div0 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(h3, "class", "svelte-9aypa6");
      attr(div0, "class", "deployment-history svelte-9aypa6");
      attr(div1, "class", "setting-section");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, h3);
      append(div1, t1);
      append(div1, div0);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div0, null);
        }
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*deploymentHistory*/
      256) {
        each_value_2 = /*deploymentHistory*/
        ctx2[8];
        let i;
        for (i = 0; i < each_value_2.length; i += 1) {
          const child_ctx = get_each_context_2(ctx2, each_value_2, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block_2(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div0, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value_2.length;
      }
    },
    d(detaching) {
      if (detaching)
        detach(div1);
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_each_block_2(ctx) {
  let div5;
  let div3;
  let div0;
  let t0_value = (
    /*deployment*/
    ctx[35].name + ""
  );
  let t0;
  let t1;
  let div1;
  let t2_value = new Date(
    /*deployment*/
    ctx[35].timestamp
  ).toLocaleString() + "";
  let t2;
  let t3;
  let div2;
  let t4_value = (
    /*deployment*/
    ctx[35].status + ""
  );
  let t4;
  let t5;
  let div4;
  let a;
  let t6;
  let t7;
  return {
    c() {
      div5 = element("div");
      div3 = element("div");
      div0 = element("div");
      t0 = text(t0_value);
      t1 = space();
      div1 = element("div");
      t2 = text(t2_value);
      t3 = space();
      div2 = element("div");
      t4 = text(t4_value);
      t5 = space();
      div4 = element("div");
      a = element("a");
      t6 = text("View Site");
      t7 = space();
      attr(div0, "class", "deployment-name svelte-9aypa6");
      attr(div1, "class", "deployment-date svelte-9aypa6");
      attr(div2, "class", "deployment-status " + /*deployment*/
      ctx[35].status + " svelte-9aypa6");
      attr(div3, "class", "deployment-info svelte-9aypa6");
      attr(
        a,
        "href",
        /*deployment*/
        ctx[35].url
      );
      attr(a, "target", "_blank");
      attr(a, "class", "deployment-link svelte-9aypa6");
      attr(div4, "class", "deployment-actions");
      attr(div5, "class", "deployment-item svelte-9aypa6");
    },
    m(target, anchor) {
      insert(target, div5, anchor);
      append(div5, div3);
      append(div3, div0);
      append(div0, t0);
      append(div3, t1);
      append(div3, div1);
      append(div1, t2);
      append(div3, t3);
      append(div3, div2);
      append(div2, t4);
      append(div5, t5);
      append(div5, div4);
      append(div4, a);
      append(a, t6);
      append(div5, t7);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(div5);
    }
  };
}
function create_if_block_1$2(ctx) {
  let div2;
  let h30;
  let t1;
  let p0;
  let t4;
  let div0;
  let input0;
  let t5;
  let button0;
  let t6_value = (
    /*isGeneratingNames*/
    ctx[7] ? "Generating..." : "Generate"
  );
  let t6;
  let t7;
  let t8;
  let div1;
  let p1;
  let t10;
  let code1;
  let t11;
  let t12_value = (
    /*settings*/
    (ctx[0].siteName || "your-site-name") + ""
  );
  let t12;
  let t13;
  let t14;
  let div10;
  let h31;
  let t16;
  let div5;
  let div3;
  let t18;
  let div4;
  let select;
  let t19;
  let div9;
  let div6;
  let t21;
  let div8;
  let div7;
  let input1;
  let t22;
  let label2;
  let t23;
  let t24;
  let button1;
  let mounted;
  let dispose;
  let if_block0 = (
    /*generatedNames*/
    ctx[6].length > 0 && create_if_block_3$2(ctx)
  );
  let each_value = (
    /*themes*/
    ctx[9]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  let if_block1 = (
    /*settings*/
    ctx[0].useCustomDomain && create_if_block_2$2(ctx)
  );
  return {
    c() {
      div2 = element("div");
      h30 = element("h3");
      h30.textContent = "Step 2: Choose a Site Name";
      t1 = space();
      p0 = element("p");
      p0.innerHTML = `This will be part of your site&#39;s URL: <code>https://[site-name].netlify.app</code>`;
      t4 = space();
      div0 = element("div");
      input0 = element("input");
      t5 = space();
      button0 = element("button");
      t6 = text(t6_value);
      t7 = space();
      if (if_block0)
        if_block0.c();
      t8 = space();
      div1 = element("div");
      p1 = element("p");
      p1.textContent = "Your site will be available at:";
      t10 = space();
      code1 = element("code");
      t11 = text("https://");
      t12 = text(t12_value);
      t13 = text(".netlify.app");
      t14 = space();
      div10 = element("div");
      h31 = element("h3");
      h31.textContent = "Step 3: Deployment Options";
      t16 = space();
      div5 = element("div");
      div3 = element("div");
      div3.innerHTML = `<label for="deployment-theme">Theme:</label>`;
      t18 = space();
      div4 = element("div");
      select = element("select");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t19 = space();
      div9 = element("div");
      div6 = element("div");
      div6.innerHTML = `<label for="use-custom-domain">Use Custom Domain:</label>`;
      t21 = space();
      div8 = element("div");
      div7 = element("div");
      input1 = element("input");
      t22 = space();
      label2 = element("label");
      t23 = space();
      if (if_block1)
        if_block1.c();
      t24 = space();
      button1 = element("button");
      button1.textContent = "Complete Setup";
      attr(h30, "class", "svelte-9aypa6");
      attr(input0, "type", "text");
      attr(input0, "placeholder", "my-awesome-slides");
      attr(input0, "class", "svelte-9aypa6");
      attr(button0, "class", "site-name-generator-button svelte-9aypa6");
      attr(div0, "class", "site-name-input svelte-9aypa6");
      attr(div1, "class", "site-preview svelte-9aypa6");
      attr(div2, "class", "setup-section svelte-9aypa6");
      attr(h31, "class", "svelte-9aypa6");
      attr(div3, "class", "setting-label svelte-9aypa6");
      attr(select, "id", "deployment-theme");
      attr(select, "class", "svelte-9aypa6");
      if (
        /*settings*/
        ctx[0].deploymentTheme === void 0
      )
        add_render_callback(() => (
          /*select_change_handler*/
          ctx[19].call(select)
        ));
      attr(div4, "class", "setting-control svelte-9aypa6");
      attr(div5, "class", "setting-item svelte-9aypa6");
      attr(div6, "class", "setting-label svelte-9aypa6");
      attr(input1, "type", "checkbox");
      attr(input1, "id", "use-custom-domain");
      attr(input1, "class", "svelte-9aypa6");
      attr(label2, "class", "toggle svelte-9aypa6");
      attr(label2, "for", "use-custom-domain");
      attr(div7, "class", "toggle-container svelte-9aypa6");
      attr(div8, "class", "setting-control svelte-9aypa6");
      attr(div9, "class", "setting-item svelte-9aypa6");
      attr(div10, "class", "setup-section svelte-9aypa6");
      attr(button1, "class", "complete-setup-button svelte-9aypa6");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, h30);
      append(div2, t1);
      append(div2, p0);
      append(div2, t4);
      append(div2, div0);
      append(div0, input0);
      set_input_value(
        input0,
        /*settings*/
        ctx[0].siteName
      );
      append(div0, t5);
      append(div0, button0);
      append(button0, t6);
      append(div2, t7);
      if (if_block0)
        if_block0.m(div2, null);
      append(div2, t8);
      append(div2, div1);
      append(div1, p1);
      append(div1, t10);
      append(div1, code1);
      append(code1, t11);
      append(code1, t12);
      append(code1, t13);
      insert(target, t14, anchor);
      insert(target, div10, anchor);
      append(div10, h31);
      append(div10, t16);
      append(div10, div5);
      append(div5, div3);
      append(div5, t18);
      append(div5, div4);
      append(div4, select);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(select, null);
        }
      }
      select_option(
        select,
        /*settings*/
        ctx[0].deploymentTheme,
        true
      );
      append(div10, t19);
      append(div10, div9);
      append(div9, div6);
      append(div9, t21);
      append(div9, div8);
      append(div8, div7);
      append(div7, input1);
      input1.checked = /*settings*/
      ctx[0].useCustomDomain;
      append(div7, t22);
      append(div7, label2);
      append(div10, t23);
      if (if_block1)
        if_block1.m(div10, null);
      insert(target, t24, anchor);
      insert(target, button1, anchor);
      if (!mounted) {
        dispose = [
          listen(
            input0,
            "input",
            /*input0_input_handler*/
            ctx[17]
          ),
          listen(
            input0,
            "change",
            /*handleSettingsChange*/
            ctx[14]
          ),
          listen(
            button0,
            "click",
            /*generateSiteNames*/
            ctx[10]
          ),
          listen(
            select,
            "change",
            /*select_change_handler*/
            ctx[19]
          ),
          listen(
            select,
            "change",
            /*handleSettingsChange*/
            ctx[14]
          ),
          listen(
            input1,
            "change",
            /*input1_change_handler*/
            ctx[20]
          ),
          listen(
            input1,
            "change",
            /*handleSettingsChange*/
            ctx[14]
          ),
          listen(
            button1,
            "click",
            /*completeSetup*/
            ctx[13]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*settings, themes*/
      513 && input0.value !== /*settings*/
      ctx2[0].siteName) {
        set_input_value(
          input0,
          /*settings*/
          ctx2[0].siteName
        );
      }
      if (dirty[0] & /*isGeneratingNames*/
      128 && t6_value !== (t6_value = /*isGeneratingNames*/
      ctx2[7] ? "Generating..." : "Generate"))
        set_data(t6, t6_value);
      if (
        /*generatedNames*/
        ctx2[6].length > 0
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_3$2(ctx2);
          if_block0.c();
          if_block0.m(div2, t8);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (dirty[0] & /*settings*/
      1 && t12_value !== (t12_value = /*settings*/
      (ctx2[0].siteName || "your-site-name") + ""))
        set_data(t12, t12_value);
      if (dirty[0] & /*themes*/
      512) {
        each_value = /*themes*/
        ctx2[9];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(select, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (dirty[0] & /*settings, themes*/
      513) {
        select_option(
          select,
          /*settings*/
          ctx2[0].deploymentTheme
        );
      }
      if (dirty[0] & /*settings, themes*/
      513) {
        input1.checked = /*settings*/
        ctx2[0].useCustomDomain;
      }
      if (
        /*settings*/
        ctx2[0].useCustomDomain
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block_2$2(ctx2);
          if_block1.c();
          if_block1.m(div10, null);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
    },
    d(detaching) {
      if (detaching)
        detach(div2);
      if (if_block0)
        if_block0.d();
      if (detaching)
        detach(t14);
      if (detaching)
        detach(div10);
      destroy_each(each_blocks, detaching);
      if (if_block1)
        if_block1.d();
      if (detaching)
        detach(t24);
      if (detaching)
        detach(button1);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_3$2(ctx) {
  let div1;
  let p;
  let t1;
  let div0;
  let each_value_1 = (
    /*generatedNames*/
    ctx[6]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value_1.length; i += 1) {
    each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
  }
  return {
    c() {
      div1 = element("div");
      p = element("p");
      p.textContent = "Suggestions:";
      t1 = space();
      div0 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div0, "class", "name-suggestions svelte-9aypa6");
      attr(div1, "class", "generated-names svelte-9aypa6");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, p);
      append(div1, t1);
      append(div1, div0);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div0, null);
        }
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*selectSiteName, generatedNames*/
      2112) {
        each_value_1 = /*generatedNames*/
        ctx2[6];
        let i;
        for (i = 0; i < each_value_1.length; i += 1) {
          const child_ctx = get_each_context_1(ctx2, each_value_1, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block_1(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div0, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value_1.length;
      }
    },
    d(detaching) {
      if (detaching)
        detach(div1);
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_each_block_1(ctx) {
  let button;
  let t0_value = (
    /*name*/
    ctx[32] + ""
  );
  let t0;
  let t1;
  let mounted;
  let dispose;
  function click_handler() {
    return (
      /*click_handler*/
      ctx[18](
        /*name*/
        ctx[32]
      )
    );
  }
  return {
    c() {
      button = element("button");
      t0 = text(t0_value);
      t1 = space();
      attr(button, "class", "suggested-name svelte-9aypa6");
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, t0);
      append(button, t1);
      if (!mounted) {
        dispose = listen(button, "click", click_handler);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & /*generatedNames*/
      64 && t0_value !== (t0_value = /*name*/
      ctx[32] + ""))
        set_data(t0, t0_value);
    },
    d(detaching) {
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
function create_each_block(ctx) {
  let option;
  let t_value = (
    /*theme*/
    ctx[29].name + ""
  );
  let t;
  return {
    c() {
      option = element("option");
      t = text(t_value);
      option.__value = /*theme*/
      ctx[29].id;
      option.value = option.__value;
    },
    m(target, anchor) {
      insert(target, option, anchor);
      append(option, t);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(option);
    }
  };
}
function create_if_block_2$2(ctx) {
  let div2;
  let div0;
  let t1;
  let div1;
  let input;
  let t2;
  let p;
  let mounted;
  let dispose;
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      div0.innerHTML = `<label for="custom-domain">Custom Domain:</label>`;
      t1 = space();
      div1 = element("div");
      input = element("input");
      t2 = space();
      p = element("p");
      p.textContent = "Note: You'll need to configure DNS settings in your domain provider's dashboard";
      attr(div0, "class", "setting-label svelte-9aypa6");
      attr(input, "type", "text");
      attr(input, "id", "custom-domain");
      attr(input, "placeholder", "slides.yourdomain.com");
      attr(input, "class", "svelte-9aypa6");
      attr(div1, "class", "setting-control svelte-9aypa6");
      attr(div2, "class", "setting-item indented svelte-9aypa6");
      attr(p, "class", "info-text svelte-9aypa6");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, div0);
      append(div2, t1);
      append(div2, div1);
      append(div1, input);
      set_input_value(
        input,
        /*settings*/
        ctx[0].customDomain
      );
      insert(target, t2, anchor);
      insert(target, p, anchor);
      if (!mounted) {
        dispose = [
          listen(
            input,
            "input",
            /*input_input_handler*/
            ctx[21]
          ),
          listen(
            input,
            "change",
            /*handleSettingsChange*/
            ctx[14]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*settings, themes*/
      513 && input.value !== /*settings*/
      ctx2[0].customDomain) {
        set_input_value(
          input,
          /*settings*/
          ctx2[0].customDomain
        );
      }
    },
    d(detaching) {
      if (detaching)
        detach(div2);
      if (detaching)
        detach(t2);
      if (detaching)
        detach(p);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment$2(ctx) {
  let div;
  let current_block_type_index;
  let if_block;
  let current;
  const if_block_creators = [create_if_block$2, create_else_block$1];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*showSetupWizard*/
      ctx2[5]
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      div = element("div");
      if_block.c();
      attr(div, "class", "advanced-slides-netlify-settings svelte-9aypa6");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if_blocks[current_block_type_index].m(div, null);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(div, null);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if_blocks[current_block_type_index].d();
    }
  };
}
function instance$2($$self, $$props, $$invalidate) {
  let { settings } = $$props;
  let { saveSettings } = $$props;
  let { netlifyService } = $$props;
  let isValidatingToken = false;
  let tokenValidated = false;
  let validationMessage = "";
  let showSetupWizard = !settings.hasCompletedSetup;
  let deploymentHistory = settings.deploymentHistory || [];
  let themes = [
    { id: "default", name: "Default" },
    { id: "dark", name: "Dark" },
    { id: "light", name: "Light" },
    { id: "minimal", name: "Minimal" }
  ];
  let generatedNames = [];
  let isGeneratingNames = false;
  async function generateSiteNames() {
    $$invalidate(7, isGeneratingNames = true);
    const adjectives = [
      "amazing",
      "brilliant",
      "clever",
      "delightful",
      "elegant",
      "fancy",
      "gorgeous"
    ];
    const nouns = ["slides", "presentation", "deck", "showcase", "talk", "briefing", "pitch"];
    $$invalidate(6, generatedNames = []);
    for (let i = 0; i < 5; i++) {
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const randomNum = Math.floor(Math.random() * 1e3);
      generatedNames.push(`${adjective}-${noun}-${randomNum}`);
    }
    $$invalidate(7, isGeneratingNames = false);
  }
  function selectSiteName(name) {
    $$invalidate(0, settings.siteName = name, settings);
    saveSettings();
  }
  async function validateToken() {
    if (!settings.netlifyToken) {
      $$invalidate(4, validationMessage = "Please enter a Netlify token first");
      return;
    }
    $$invalidate(2, isValidatingToken = true);
    $$invalidate(4, validationMessage = "");
    try {
      const isValid = await netlifyService.validateToken(settings.netlifyToken);
      $$invalidate(3, tokenValidated = isValid);
      $$invalidate(4, validationMessage = isValid ? "Token is valid!" : "Invalid token. Please check and try again.");
    } catch (error) {
      $$invalidate(4, validationMessage = `Error validating token: ${error.message}`);
      $$invalidate(3, tokenValidated = false);
    } finally {
      $$invalidate(2, isValidatingToken = false);
    }
    if (tokenValidated) {
      await saveSettings();
    }
  }
  function completeSetup() {
    $$invalidate(0, settings.hasCompletedSetup = true, settings);
    saveSettings();
    $$invalidate(5, showSetupWizard = false);
  }
  function handleSettingsChange() {
    saveSettings();
  }
  onMount(() => {
    if (!settings.siteName) {
      generateSiteNames();
    }
  });
  const tokenGenerated_handler = (event) => {
    $$invalidate(0, settings.netlifyToken = event.detail.token, settings);
    validateToken();
  };
  function input0_input_handler() {
    settings.siteName = this.value;
    $$invalidate(0, settings);
    $$invalidate(9, themes);
  }
  const click_handler = (name) => selectSiteName(name);
  function select_change_handler() {
    settings.deploymentTheme = select_value(this);
    $$invalidate(0, settings);
    $$invalidate(9, themes);
  }
  function input1_change_handler() {
    settings.useCustomDomain = this.checked;
    $$invalidate(0, settings);
    $$invalidate(9, themes);
  }
  function input_input_handler() {
    settings.customDomain = this.value;
    $$invalidate(0, settings);
    $$invalidate(9, themes);
  }
  function input0_input_handler_1() {
    settings.netlifyToken = this.value;
    $$invalidate(0, settings);
    $$invalidate(9, themes);
  }
  function input1_input_handler() {
    settings.siteName = this.value;
    $$invalidate(0, settings);
    $$invalidate(9, themes);
  }
  const click_handler_1 = (name) => selectSiteName(name);
  function select_change_handler_1() {
    settings.deploymentTheme = select_value(this);
    $$invalidate(0, settings);
    $$invalidate(9, themes);
  }
  function input2_change_handler() {
    settings.useCustomDomain = this.checked;
    $$invalidate(0, settings);
    $$invalidate(9, themes);
  }
  function input_input_handler_1() {
    settings.customDomain = this.value;
    $$invalidate(0, settings);
    $$invalidate(9, themes);
  }
  const click_handler_2 = () => {
    $$invalidate(5, showSetupWizard = true);
    $$invalidate(0, settings.hasCompletedSetup = false, settings);
    saveSettings();
  };
  $$self.$$set = ($$props2) => {
    if ("settings" in $$props2)
      $$invalidate(0, settings = $$props2.settings);
    if ("saveSettings" in $$props2)
      $$invalidate(1, saveSettings = $$props2.saveSettings);
    if ("netlifyService" in $$props2)
      $$invalidate(15, netlifyService = $$props2.netlifyService);
  };
  return [
    settings,
    saveSettings,
    isValidatingToken,
    tokenValidated,
    validationMessage,
    showSetupWizard,
    generatedNames,
    isGeneratingNames,
    deploymentHistory,
    themes,
    generateSiteNames,
    selectSiteName,
    validateToken,
    completeSetup,
    handleSettingsChange,
    netlifyService,
    tokenGenerated_handler,
    input0_input_handler,
    click_handler,
    select_change_handler,
    input1_change_handler,
    input_input_handler,
    input0_input_handler_1,
    input1_input_handler,
    click_handler_1,
    select_change_handler_1,
    input2_change_handler,
    input_input_handler_1,
    click_handler_2
  ];
}
class Settings extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance$2,
      create_fragment$2,
      safe_not_equal,
      {
        settings: 0,
        saveSettings: 1,
        netlifyService: 15
      },
      null,
      [-1, -1]
    );
  }
}
const DeploymentStatus_svelte_svelte_type_style_lang = "";
function create_if_block_5(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = "✕";
      attr(div, "class", "error-icon svelte-18xpazx");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_if_block_4$1(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = "✓";
      attr(div, "class", "success-icon svelte-18xpazx");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_if_block_3$1(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "spinner svelte-18xpazx");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_if_block_2$1(ctx) {
  let div1;
  let div0;
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      attr(div0, "class", "progress-bar svelte-18xpazx");
      set_style(
        div0,
        "width",
        /*progress*/
        ctx[1] + "%"
      );
      attr(div1, "class", "progress-container svelte-18xpazx");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
    },
    p(ctx2, dirty) {
      if (dirty & /*progress*/
      2) {
        set_style(
          div0,
          "width",
          /*progress*/
          ctx2[1] + "%"
        );
      }
    },
    d(detaching) {
      if (detaching)
        detach(div1);
    }
  };
}
function create_if_block_1$1(ctx) {
  let div1;
  let p0;
  let t0;
  let t1;
  let t2;
  let div0;
  return {
    c() {
      div1 = element("div");
      p0 = element("p");
      t0 = text("Error: ");
      t1 = text(
        /*error*/
        ctx[2]
      );
      t2 = space();
      div0 = element("div");
      div0.innerHTML = `<p><strong>Troubleshooting tips:</strong></p> 
        <ul class="svelte-18xpazx"><li class="svelte-18xpazx">Check your Netlify authentication token</li> 
          <li class="svelte-18xpazx">Ensure Advanced Slides plugin is installed and active</li> 
          <li class="svelte-18xpazx">Check your internet connection</li> 
          <li class="svelte-18xpazx">Try again in a few minutes</li></ul>`;
      attr(div0, "class", "troubleshooting-tips svelte-18xpazx");
      attr(div1, "class", "error-details svelte-18xpazx");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, p0);
      append(p0, t0);
      append(p0, t1);
      append(div1, t2);
      append(div1, div0);
    },
    p(ctx2, dirty) {
      if (dirty & /*error*/
      4)
        set_data(
          t1,
          /*error*/
          ctx2[2]
        );
    },
    d(detaching) {
      if (detaching)
        detach(div1);
    }
  };
}
function create_if_block$1(ctx) {
  let div;
  let p;
  let t1;
  let a;
  let t2;
  return {
    c() {
      div = element("div");
      p = element("p");
      p.textContent = "Your presentation is now live at:";
      t1 = space();
      a = element("a");
      t2 = text(
        /*url*/
        ctx[3]
      );
      attr(
        a,
        "href",
        /*url*/
        ctx[3]
      );
      attr(a, "target", "_blank");
      attr(a, "class", "deployment-url svelte-18xpazx");
      attr(div, "class", "success-details svelte-18xpazx");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, p);
      append(div, t1);
      append(div, a);
      append(a, t2);
    },
    p(ctx2, dirty) {
      if (dirty & /*url*/
      8)
        set_data(
          t2,
          /*url*/
          ctx2[3]
        );
      if (dirty & /*url*/
      8) {
        attr(
          a,
          "href",
          /*url*/
          ctx2[3]
        );
      }
    },
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_fragment$1(ctx) {
  let div4;
  let div3;
  let div1;
  let t0;
  let div0;
  let t1_value = (
    /*statusMessages*/
    ctx[5][
      /*status*/
      ctx[0]
    ] + ""
  );
  let t1;
  let t2;
  let div2;
  let t3_value = (
    /*formatDuration*/
    ctx[4]() + ""
  );
  let t3;
  let t4;
  let t5;
  let div4_class_value;
  function select_block_type(ctx2, dirty) {
    if (
      /*status*/
      ctx2[0] === "preparing" || /*status*/
      ctx2[0] === "exporting" || /*status*/
      ctx2[0] === "deploying"
    )
      return create_if_block_3$1;
    if (
      /*status*/
      ctx2[0] === "success"
    )
      return create_if_block_4$1;
    if (
      /*status*/
      ctx2[0] === "error"
    )
      return create_if_block_5;
  }
  let current_block_type = select_block_type(ctx);
  let if_block0 = current_block_type && current_block_type(ctx);
  let if_block1 = (
    /*status*/
    ctx[0] !== "success" && /*status*/
    ctx[0] !== "error" && create_if_block_2$1(ctx)
  );
  function select_block_type_1(ctx2, dirty) {
    if (
      /*status*/
      ctx2[0] === "success" && /*url*/
      ctx2[3]
    )
      return create_if_block$1;
    if (
      /*status*/
      ctx2[0] === "error" && /*error*/
      ctx2[2]
    )
      return create_if_block_1$1;
  }
  let current_block_type_1 = select_block_type_1(ctx);
  let if_block2 = current_block_type_1 && current_block_type_1(ctx);
  return {
    c() {
      div4 = element("div");
      div3 = element("div");
      div1 = element("div");
      if (if_block0)
        if_block0.c();
      t0 = space();
      div0 = element("div");
      t1 = text(t1_value);
      t2 = space();
      div2 = element("div");
      t3 = text(t3_value);
      t4 = space();
      if (if_block1)
        if_block1.c();
      t5 = space();
      if (if_block2)
        if_block2.c();
      attr(div0, "class", "status-message svelte-18xpazx");
      attr(div1, "class", "status-indicator svelte-18xpazx");
      attr(div2, "class", "elapsed-time svelte-18xpazx");
      attr(div3, "class", "status-header svelte-18xpazx");
      attr(div4, "class", div4_class_value = "deployment-status " + /*status*/
      ctx[0] + " svelte-18xpazx");
    },
    m(target, anchor) {
      insert(target, div4, anchor);
      append(div4, div3);
      append(div3, div1);
      if (if_block0)
        if_block0.m(div1, null);
      append(div1, t0);
      append(div1, div0);
      append(div0, t1);
      append(div3, t2);
      append(div3, div2);
      append(div2, t3);
      append(div4, t4);
      if (if_block1)
        if_block1.m(div4, null);
      append(div4, t5);
      if (if_block2)
        if_block2.m(div4, null);
    },
    p(ctx2, [dirty]) {
      if (current_block_type !== (current_block_type = select_block_type(ctx2))) {
        if (if_block0)
          if_block0.d(1);
        if_block0 = current_block_type && current_block_type(ctx2);
        if (if_block0) {
          if_block0.c();
          if_block0.m(div1, t0);
        }
      }
      if (dirty & /*status*/
      1 && t1_value !== (t1_value = /*statusMessages*/
      ctx2[5][
        /*status*/
        ctx2[0]
      ] + ""))
        set_data(t1, t1_value);
      if (dirty & /*formatDuration*/
      16 && t3_value !== (t3_value = /*formatDuration*/
      ctx2[4]() + ""))
        set_data(t3, t3_value);
      if (
        /*status*/
        ctx2[0] !== "success" && /*status*/
        ctx2[0] !== "error"
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block_2$1(ctx2);
          if_block1.c();
          if_block1.m(div4, t5);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx2)) && if_block2) {
        if_block2.p(ctx2, dirty);
      } else {
        if (if_block2)
          if_block2.d(1);
        if_block2 = current_block_type_1 && current_block_type_1(ctx2);
        if (if_block2) {
          if_block2.c();
          if_block2.m(div4, null);
        }
      }
      if (dirty & /*status*/
      1 && div4_class_value !== (div4_class_value = "deployment-status " + /*status*/
      ctx2[0] + " svelte-18xpazx")) {
        attr(div4, "class", div4_class_value);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div4);
      if (if_block0) {
        if_block0.d();
      }
      if (if_block1)
        if_block1.d();
      if (if_block2) {
        if_block2.d();
      }
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let { status = "preparing" } = $$props;
  let { progress = 0 } = $$props;
  let { error = "" } = $$props;
  let { url = "" } = $$props;
  let { startTime = Date.now() } = $$props;
  let { endTime = null } = $$props;
  let { formatDuration = () => "00:00" } = $$props;
  let timer;
  onMount(() => {
    timer = window.setInterval(
      () => {
      },
      1e3
    );
  });
  onDestroy(() => {
    clearInterval(timer);
  });
  const statusMessages = {
    preparing: "Preparing to deploy...",
    exporting: "Exporting slides...",
    deploying: "Uploading to Netlify...",
    success: "Deployment successful!",
    error: "Deployment failed"
  };
  $$self.$$set = ($$props2) => {
    if ("status" in $$props2)
      $$invalidate(0, status = $$props2.status);
    if ("progress" in $$props2)
      $$invalidate(1, progress = $$props2.progress);
    if ("error" in $$props2)
      $$invalidate(2, error = $$props2.error);
    if ("url" in $$props2)
      $$invalidate(3, url = $$props2.url);
    if ("startTime" in $$props2)
      $$invalidate(6, startTime = $$props2.startTime);
    if ("endTime" in $$props2)
      $$invalidate(7, endTime = $$props2.endTime);
    if ("formatDuration" in $$props2)
      $$invalidate(4, formatDuration = $$props2.formatDuration);
  };
  return [
    status,
    progress,
    error,
    url,
    formatDuration,
    statusMessages,
    startTime,
    endTime
  ];
}
class DeploymentStatus extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, {
      status: 0,
      progress: 1,
      error: 2,
      url: 3,
      startTime: 6,
      endTime: 7,
      formatDuration: 4
    });
  }
}
class SlidesExporter {
  constructor(app) {
    this.app = app;
  }
  /**
   * Export slides from a markdown file using either Advanced Slides or Slides Extended plugin
   */
  async exportSlides(file) {
    try {
      const advancedSlides = this.app.plugins.plugins["obsidian-advanced-slides"];
      const slidesExtended = this.app.plugins.plugins["slides-extended"];
      const slidesPlugin = advancedSlides || slidesExtended;
      if (!slidesPlugin) {
        throw new Error("Neither Advanced Slides nor Slides Extended plugin is installed and enabled");
      }
      const content = await this.app.vault.read(file);
      const exportFolderPath = this.getExportPath(file);
      console.log("Using export path:", exportFolderPath);
      await this.ensureDirectoryExists(exportFolderPath);
      try {
        const pluginId = advancedSlides ? "Advanced Slides" : "Slides Extended";
        new obsidian.Notice(`Exporting with ${pluginId}...`);
        if (slidesExtended) {
          await slidesExtended.renderer.export(file.path, exportFolderPath, "static");
        } else if (advancedSlides.exportSlides && typeof advancedSlides.exportSlides === "function") {
          await advancedSlides.exportSlides(file.path, exportFolderPath, "static");
        } else if (advancedSlides.slideManager && typeof advancedSlides.slideManager.exportSlides === "function") {
          await advancedSlides.slideManager.exportSlides(file.path, exportFolderPath, "static");
        } else {
          await this.manualExport(file, content, exportFolderPath);
        }
        return exportFolderPath;
      } catch (exportError) {
        console.error("Error exporting with slides plugin API:", exportError);
        await this.manualExport(file, content, exportFolderPath);
        return exportFolderPath;
      }
    } catch (error) {
      console.error("Failed to export slides:", error);
      throw new Error(`Failed to export slides: ${error.message}`);
    }
  }
  /**
   * Ensure the export directory exists
   */
  async ensureDirectoryExists(dirPath) {
    try {
      const exists = await this.app.vault.adapter.exists(dirPath);
      if (!exists) {
        const pathSegments = dirPath.split(/[\/\\]/);
        let currentPath = "";
        for (const segment of pathSegments) {
          if (!segment)
            continue;
          currentPath += (currentPath ? "/" : "") + segment;
          const segmentExists = await this.app.vault.adapter.exists(currentPath);
          if (!segmentExists) {
            await this.app.vault.adapter.mkdir(currentPath);
          }
        }
      }
    } catch (error) {
      console.error("Failed to create directory:", error);
      throw new Error(`Failed to create export directory: ${error.message}`);
    }
  }
  /**
   * Get the export path for a file
   */
  getExportPath(file) {
    var _a;
    try {
      const slidesExtended = this.app.plugins.plugins["slides-extended"];
      if ((_a = slidesExtended == null ? void 0 : slidesExtended.settings) == null ? void 0 : _a.exportDirectory) {
        const exportDir = slidesExtended.settings.exportDirectory.trim();
        const folderName2 = `${file.basename.replace(/[^a-zA-Z0-9]/g, "-")}-${Date.now()}`;
        if (exportDir.startsWith("/")) {
          const basePath3 = this.app.vault.adapter.getBasePath();
          const pathSeparator3 = basePath3.includes("\\") ? "\\" : "/";
          return `${basePath3}${exportDir}${pathSeparator3}${folderName2}`;
        }
        const basePath2 = this.app.vault.adapter.getBasePath();
        const pathSeparator2 = basePath2.includes("\\") ? "\\" : "/";
        return `${basePath2}${pathSeparator2}${exportDir}${pathSeparator2}${folderName2}`;
      }
      const basePath = this.app.vault.adapter.getBasePath();
      const pathSeparator = basePath.includes("\\") ? "\\" : "/";
      const folderName = `${file.basename.replace(/[^a-zA-Z0-9]/g, "-")}-${Date.now()}`;
      const pathSegments = [
        basePath,
        ".obsidian",
        "plugins",
        "advanced-slides-netlify-deployer",
        "exports",
        folderName
      ];
      return pathSegments.join(pathSeparator);
    } catch (error) {
      console.error("Error getting export path:", error);
      throw new Error(`Failed to determine export path: ${error.message}`);
    }
  }
  /**
   * Manually export slides when the API is not available
   * This is a more involved process that tries to mimic what the Advanced Slides plugin does
   */
  async manualExport(file, content, exportPath) {
    new obsidian.Notice(`Exporting ${file.basename} with Advanced Slides...`);
    try {
      const indexHtml = this.generateBasicRevealPresentation(file.basename, content);
      const indexPath = `${exportPath}/index.html`;
      await this.ensureDirectoryExists(exportPath);
      await this.app.vault.adapter.write(indexPath, indexHtml);
      const manifestContent = JSON.stringify({
        exportTime: Date.now(),
        sourcePath: file.path,
        files: ["index.html"]
      }, null, 2);
      await this.app.vault.adapter.write(`${exportPath}/manifest.json`, manifestContent);
      new obsidian.Notice(`Export completed! Files saved to ${exportPath}`);
    } catch (error) {
      console.error("Manual export failed:", error);
      throw new Error(`Manual export failed: ${error.message}`);
    }
  }
  /**
   * Generate a basic reveal.js presentation HTML
   */
  generateBasicRevealPresentation(title, markdown) {
    const slideContent = markdown.split(/^---$/m).map((slide) => `<section>${slide.trim()}</section>`).join("");
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.2.1/dist/reveal.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.2.1/dist/theme/white.css">
  <style>
    .reveal pre {
      box-shadow: none;
    }
    .reveal h1, .reveal h2, .reveal h3, .reveal h4, .reveal h5, .reveal h6 {
      text-transform: none;
    }
  </style>
</head>
<body>
  <div class="reveal">
    <div class="slides">
      ${slideContent}
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.2.1/dist/reveal.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.2.1/plugin/markdown/markdown.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.2.1/plugin/highlight/highlight.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.2.1/plugin/notes/notes.js"><\/script>
  <script>
    Reveal.initialize({
      hash: true,
      plugins: [ RevealMarkdown, RevealHighlight, RevealNotes ]
    });
  <\/script>
</body>
</html>
    `.trim();
  }
}
const DeploymentModal_svelte_svelte_type_style_lang = "";
function create_else_block(ctx) {
  let div8;
  let div4;
  let div0;
  let t1;
  let div3;
  let div1;
  let t2_value = (
    /*file*/
    ctx[0].basename + ""
  );
  let t2;
  let t3;
  let div2;
  let t4_value = (
    /*file*/
    ctx[0].path + ""
  );
  let t4;
  let t5;
  let div6;
  let div5;
  let label;
  let t7;
  let input;
  let input_disabled_value;
  let t8;
  let deploymentstatus;
  let t9;
  let t10;
  let t11;
  let div7;
  let current;
  let mounted;
  let dispose;
  deploymentstatus = new DeploymentStatus({
    props: {
      status: (
        /*deploymentStatus*/
        ctx[3]
      ),
      progress: (
        /*progress*/
        ctx[6]
      ),
      error: (
        /*errorMessage*/
        ctx[5]
      ),
      url: (
        /*deploymentUrl*/
        ctx[4]
      ),
      startTime: (
        /*deploymentStartTime*/
        ctx[10]
      ),
      endTime: (
        /*deploymentEndTime*/
        ctx[8]
      ),
      formatDuration: (
        /*formatDuration*/
        ctx[12]
      )
    }
  });
  let if_block0 = (
    /*deploymentStatus*/
    ctx[3] === "error" && create_if_block_4(ctx)
  );
  let if_block1 = (
    /*logs*/
    ctx[9].length > 0 && create_if_block_3(ctx)
  );
  function select_block_type_1(ctx2, dirty) {
    if (
      /*deploymentStatus*/
      ctx2[3] === "success"
    )
      return create_if_block_1;
    if (
      /*deploymentStatus*/
      ctx2[3] === "error"
    )
      return create_if_block_2;
    return create_else_block_1;
  }
  let current_block_type = select_block_type_1(ctx);
  let if_block2 = current_block_type(ctx);
  return {
    c() {
      div8 = element("div");
      div4 = element("div");
      div0 = element("div");
      div0.textContent = "📄";
      t1 = space();
      div3 = element("div");
      div1 = element("div");
      t2 = text(t2_value);
      t3 = space();
      div2 = element("div");
      t4 = text(t4_value);
      t5 = space();
      div6 = element("div");
      div5 = element("div");
      label = element("label");
      label.textContent = "Deployment Name:";
      t7 = space();
      input = element("input");
      t8 = space();
      create_component(deploymentstatus.$$.fragment);
      t9 = space();
      if (if_block0)
        if_block0.c();
      t10 = space();
      if (if_block1)
        if_block1.c();
      t11 = space();
      div7 = element("div");
      if_block2.c();
      attr(div0, "class", "file-icon svelte-nejo5k");
      attr(div1, "class", "file-name svelte-nejo5k");
      attr(div2, "class", "file-path svelte-nejo5k");
      attr(div3, "class", "file-details svelte-nejo5k");
      attr(div4, "class", "file-info svelte-nejo5k");
      attr(label, "for", "deployment-name");
      attr(label, "class", "svelte-nejo5k");
      attr(input, "type", "text");
      attr(input, "id", "deployment-name");
      input.disabled = input_disabled_value = /*deploymentStatus*/
      ctx[3] !== "preparing";
      attr(input, "class", "svelte-nejo5k");
      attr(div5, "class", "form-group svelte-nejo5k");
      attr(div6, "class", "deployment-form svelte-nejo5k");
      attr(div7, "class", "button-container svelte-nejo5k");
      attr(div8, "class", "deployment-container");
    },
    m(target, anchor) {
      insert(target, div8, anchor);
      append(div8, div4);
      append(div4, div0);
      append(div4, t1);
      append(div4, div3);
      append(div3, div1);
      append(div1, t2);
      append(div3, t3);
      append(div3, div2);
      append(div2, t4);
      append(div8, t5);
      append(div8, div6);
      append(div6, div5);
      append(div5, label);
      append(div5, t7);
      append(div5, input);
      set_input_value(
        input,
        /*deploymentName*/
        ctx[2]
      );
      append(div8, t8);
      mount_component(deploymentstatus, div8, null);
      append(div8, t9);
      if (if_block0)
        if_block0.m(div8, null);
      append(div8, t10);
      if (if_block1)
        if_block1.m(div8, null);
      append(div8, t11);
      append(div8, div7);
      if_block2.m(div7, null);
      current = true;
      if (!mounted) {
        dispose = listen(
          input,
          "input",
          /*input_input_handler*/
          ctx[19]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if ((!current || dirty & /*file*/
      1) && t2_value !== (t2_value = /*file*/
      ctx2[0].basename + ""))
        set_data(t2, t2_value);
      if ((!current || dirty & /*file*/
      1) && t4_value !== (t4_value = /*file*/
      ctx2[0].path + ""))
        set_data(t4, t4_value);
      if (!current || dirty & /*deploymentStatus*/
      8 && input_disabled_value !== (input_disabled_value = /*deploymentStatus*/
      ctx2[3] !== "preparing")) {
        input.disabled = input_disabled_value;
      }
      if (dirty & /*deploymentName*/
      4 && input.value !== /*deploymentName*/
      ctx2[2]) {
        set_input_value(
          input,
          /*deploymentName*/
          ctx2[2]
        );
      }
      const deploymentstatus_changes = {};
      if (dirty & /*deploymentStatus*/
      8)
        deploymentstatus_changes.status = /*deploymentStatus*/
        ctx2[3];
      if (dirty & /*progress*/
      64)
        deploymentstatus_changes.progress = /*progress*/
        ctx2[6];
      if (dirty & /*errorMessage*/
      32)
        deploymentstatus_changes.error = /*errorMessage*/
        ctx2[5];
      if (dirty & /*deploymentUrl*/
      16)
        deploymentstatus_changes.url = /*deploymentUrl*/
        ctx2[4];
      if (dirty & /*deploymentEndTime*/
      256)
        deploymentstatus_changes.endTime = /*deploymentEndTime*/
        ctx2[8];
      deploymentstatus.$set(deploymentstatus_changes);
      if (
        /*deploymentStatus*/
        ctx2[3] === "error"
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_4(ctx2);
          if_block0.c();
          if_block0.m(div8, t10);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (
        /*logs*/
        ctx2[9].length > 0
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block_3(ctx2);
          if_block1.c();
          if_block1.m(div8, t11);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (current_block_type === (current_block_type = select_block_type_1(ctx2)) && if_block2) {
        if_block2.p(ctx2, dirty);
      } else {
        if_block2.d(1);
        if_block2 = current_block_type(ctx2);
        if (if_block2) {
          if_block2.c();
          if_block2.m(div7, null);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(deploymentstatus.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(deploymentstatus.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div8);
      destroy_component(deploymentstatus);
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
      if_block2.d();
      mounted = false;
      dispose();
    }
  };
}
function create_if_block(ctx) {
  let div;
  let p;
  let t1;
  let authflow;
  let current;
  authflow = new AuthFlow({});
  authflow.$on(
    "tokenGenerated",
    /*tokenGenerated_handler*/
    ctx[18]
  );
  return {
    c() {
      div = element("div");
      p = element("p");
      p.textContent = "You need to authenticate with Netlify first:";
      t1 = space();
      create_component(authflow.$$.fragment);
      attr(div, "class", "auth-container svelte-nejo5k");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, p);
      append(div, t1);
      mount_component(authflow, div, null);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(authflow.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(authflow.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(authflow);
    }
  };
}
function create_if_block_4(ctx) {
  let div2;
  let div0;
  let t0;
  let t1;
  let t2;
  let div1;
  let t12;
  let button;
  let mounted;
  let dispose;
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      t0 = text("Error: ");
      t1 = text(
        /*errorMessage*/
        ctx[5]
      );
      t2 = space();
      div1 = element("div");
      div1.innerHTML = `<h4>Troubleshooting tips:</h4> 
            <ul><li>Check your Netlify authentication token</li> 
              <li>Ensure Advanced Slides plugin is installed and active</li> 
              <li>Check your internet connection</li> 
              <li>Try again in a few minutes</li></ul>`;
      t12 = space();
      button = element("button");
      button.textContent = "Copy Logs to Clipboard";
      attr(div0, "class", "error-message");
      attr(div1, "class", "troubleshooting");
      attr(button, "class", "copy-logs-button svelte-nejo5k");
      attr(div2, "class", "error-section");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, div0);
      append(div0, t0);
      append(div0, t1);
      append(div2, t2);
      append(div2, div1);
      append(div2, t12);
      append(div2, button);
      if (!mounted) {
        dispose = listen(
          button,
          "click",
          /*click_handler*/
          ctx[20]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*errorMessage*/
      32)
        set_data(
          t1,
          /*errorMessage*/
          ctx2[5]
        );
    },
    d(detaching) {
      if (detaching)
        detach(div2);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_3(ctx) {
  let div1;
  let div0;
  let h4;
  let t1;
  let button;
  let t3;
  let pre;
  let t4_value = (
    /*logs*/
    ctx[9].join("\n") + ""
  );
  let t4;
  let mounted;
  let dispose;
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      h4 = element("h4");
      h4.textContent = "Deployment Logs:";
      t1 = space();
      button = element("button");
      button.textContent = "Copy Logs";
      t3 = space();
      pre = element("pre");
      t4 = text(t4_value);
      attr(button, "class", "copy-logs-button svelte-nejo5k");
      attr(div0, "class", "logs-header svelte-nejo5k");
      attr(pre, "class", "logs svelte-nejo5k");
      attr(div1, "class", "logs-section svelte-nejo5k");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, h4);
      append(div0, t1);
      append(div0, button);
      append(div1, t3);
      append(div1, pre);
      append(pre, t4);
      if (!mounted) {
        dispose = listen(
          button,
          "click",
          /*click_handler_1*/
          ctx[21]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*logs*/
      512 && t4_value !== (t4_value = /*logs*/
      ctx2[9].join("\n") + ""))
        set_data(t4, t4_value);
    },
    d(detaching) {
      if (detaching)
        detach(div1);
      mounted = false;
      dispose();
    }
  };
}
function create_else_block_1(ctx) {
  let button;
  let mounted;
  let dispose;
  return {
    c() {
      button = element("button");
      button.textContent = "Cancel";
      attr(button, "class", "cancel-button svelte-nejo5k");
    },
    m(target, anchor) {
      insert(target, button, anchor);
      if (!mounted) {
        dispose = listen(button, "click", function() {
          if (is_function(
            /*close*/
            ctx[1]
          ))
            ctx[1].apply(this, arguments);
        });
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
    },
    d(detaching) {
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_2(ctx) {
  let button0;
  let t1;
  let button1;
  let mounted;
  let dispose;
  return {
    c() {
      button0 = element("button");
      button0.textContent = "Try Again";
      t1 = space();
      button1 = element("button");
      button1.textContent = "Cancel";
      attr(button0, "class", "retry-button svelte-nejo5k");
      attr(button1, "class", "close-button-text svelte-nejo5k");
    },
    m(target, anchor) {
      insert(target, button0, anchor);
      insert(target, t1, anchor);
      insert(target, button1, anchor);
      if (!mounted) {
        dispose = [
          listen(
            button0,
            "click",
            /*deploy*/
            ctx[11]
          ),
          listen(button1, "click", function() {
            if (is_function(
              /*close*/
              ctx[1]
            ))
              ctx[1].apply(this, arguments);
          })
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
    },
    d(detaching) {
      if (detaching)
        detach(button0);
      if (detaching)
        detach(t1);
      if (detaching)
        detach(button1);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_1(ctx) {
  let a;
  let t0;
  let t1;
  let button;
  let mounted;
  let dispose;
  return {
    c() {
      a = element("a");
      t0 = text("View Deployment");
      t1 = space();
      button = element("button");
      button.textContent = "Close";
      attr(
        a,
        "href",
        /*deploymentUrl*/
        ctx[4]
      );
      attr(a, "target", "_blank");
      attr(a, "class", "view-button svelte-nejo5k");
      attr(button, "class", "close-button-text svelte-nejo5k");
    },
    m(target, anchor) {
      insert(target, a, anchor);
      append(a, t0);
      insert(target, t1, anchor);
      insert(target, button, anchor);
      if (!mounted) {
        dispose = listen(button, "click", function() {
          if (is_function(
            /*close*/
            ctx[1]
          ))
            ctx[1].apply(this, arguments);
        });
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & /*deploymentUrl*/
      16) {
        attr(
          a,
          "href",
          /*deploymentUrl*/
          ctx[4]
        );
      }
    },
    d(detaching) {
      if (detaching)
        detach(a);
      if (detaching)
        detach(t1);
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
function create_fragment(ctx) {
  let div1;
  let div0;
  let h2;
  let t1;
  let button;
  let t3;
  let current_block_type_index;
  let if_block;
  let current;
  let mounted;
  let dispose;
  const if_block_creators = [create_if_block, create_else_block];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*showAuth*/
      ctx2[7]
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      h2 = element("h2");
      h2.textContent = "Deploy to Netlify";
      t1 = space();
      button = element("button");
      button.textContent = "×";
      t3 = space();
      if_block.c();
      attr(h2, "class", "svelte-nejo5k");
      attr(button, "class", "close-button svelte-nejo5k");
      attr(div0, "class", "modal-header svelte-nejo5k");
      attr(div1, "class", "deployment-modal svelte-nejo5k");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, h2);
      append(div0, t1);
      append(div0, button);
      append(div1, t3);
      if_blocks[current_block_type_index].m(div1, null);
      current = true;
      if (!mounted) {
        dispose = listen(button, "click", function() {
          if (is_function(
            /*close*/
            ctx[1]
          ))
            ctx[1].apply(this, arguments);
        });
        mounted = true;
      }
    },
    p(new_ctx, [dirty]) {
      ctx = new_ctx;
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
          if_block.c();
        } else {
          if_block.p(ctx, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(div1, null);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div1);
      if_blocks[current_block_type_index].d();
      mounted = false;
      dispose();
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let { file } = $$props;
  let { settings } = $$props;
  let { netlifyService } = $$props;
  let { slidesExporter } = $$props;
  let { saveSettings } = $$props;
  let { close } = $$props;
  let deploymentName = file ? file.basename : "";
  let deploymentStatus = "preparing";
  let deploymentUrl = "";
  let errorMessage = "";
  let progress = 0;
  let showAuth = !settings.netlifyToken;
  let deploymentStartTime;
  let deploymentEndTime;
  let logs = [];
  onMount(() => {
    if (settings.netlifyToken && file) {
      deploy();
    }
    netlifyService.clearDeploymentLogs();
  });
  async function deploy() {
    try {
      $$invalidate(3, deploymentStatus = "exporting");
      $$invalidate(6, progress = 10);
      $$invalidate(6, progress = 20);
      const exportPath = await slidesExporter.exportSlides(file);
      if (!exportPath) {
        throw new Error("Failed to export slides. Make sure Advanced Slides plugin is installed and active.");
      }
      $$invalidate(6, progress = 40);
      $$invalidate(3, deploymentStatus = "deploying");
      const deployment = await netlifyService.deployToNetlify(exportPath, deploymentName);
      $$invalidate(9, logs = netlifyService.getDeploymentLogs());
      if (!deployment || !deployment.url) {
        throw new Error("Deployment failed. Check your Netlify settings and try again.");
      }
      $$invalidate(4, deploymentUrl = deployment.url);
      $$invalidate(3, deploymentStatus = "success");
      $$invalidate(6, progress = 100);
      const history = settings.deploymentHistory || [];
      history.unshift({
        id: deployment.id,
        url: deployment.url,
        timestamp: Date.now(),
        name: deploymentName,
        status: deployment.state
      });
      if (history.length > 10) {
        history.pop();
      }
      await saveSettings({ ...settings, deploymentHistory: history });
      $$invalidate(8, deploymentEndTime = Date.now());
    } catch (error) {
      $$invalidate(3, deploymentStatus = "error");
      $$invalidate(5, errorMessage = error.message || "An unknown error occurred");
      console.error("Deployment error:", error);
      $$invalidate(9, logs = netlifyService.getDeploymentLogs());
    }
  }
  function formatDuration() {
    return "00:00";
  }
  function handleAuthComplete(token) {
    $$invalidate(14, settings.netlifyToken = token, settings);
    saveSettings();
    $$invalidate(7, showAuth = false);
    deploy();
  }
  const tokenGenerated_handler = (event) => handleAuthComplete(event.detail.token);
  function input_input_handler() {
    deploymentName = this.value;
    $$invalidate(2, deploymentName);
  }
  const click_handler = () => {
    const logText = logs.join("\n");
    navigator.clipboard.writeText(logText);
    new obsidian.Notice("Logs copied to clipboard");
  };
  const click_handler_1 = () => {
    const logText = logs.join("\n");
    navigator.clipboard.writeText(logText);
    new obsidian.Notice("Logs copied to clipboard");
  };
  $$self.$$set = ($$props2) => {
    if ("file" in $$props2)
      $$invalidate(0, file = $$props2.file);
    if ("settings" in $$props2)
      $$invalidate(14, settings = $$props2.settings);
    if ("netlifyService" in $$props2)
      $$invalidate(15, netlifyService = $$props2.netlifyService);
    if ("slidesExporter" in $$props2)
      $$invalidate(16, slidesExporter = $$props2.slidesExporter);
    if ("saveSettings" in $$props2)
      $$invalidate(17, saveSettings = $$props2.saveSettings);
    if ("close" in $$props2)
      $$invalidate(1, close = $$props2.close);
  };
  return [
    file,
    close,
    deploymentName,
    deploymentStatus,
    deploymentUrl,
    errorMessage,
    progress,
    showAuth,
    deploymentEndTime,
    logs,
    deploymentStartTime,
    deploy,
    formatDuration,
    handleAuthComplete,
    settings,
    netlifyService,
    slidesExporter,
    saveSettings,
    tokenGenerated_handler,
    input_input_handler,
    click_handler,
    click_handler_1
  ];
}
class DeploymentModal extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {
      file: 0,
      settings: 14,
      netlifyService: 15,
      slidesExporter: 16,
      saveSettings: 17,
      close: 1
    });
  }
}
const DEFAULT_SETTINGS = {
  netlifyToken: "",
  siteId: "",
  siteName: "",
  useCustomDomain: false,
  customDomain: "",
  deploymentTheme: "default",
  deploymentHistory: [],
  hasCompletedSetup: false
};
const NETLIFY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
	<path d="M12 2L2 12h3v8h14v-8h3L12 2z"/>
	<path d="M12 6l-4 4h8l-4-4z"/>
</svg>`;
class SlidesNetlifyDeployer extends obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    obsidian.addIcon("netlify-deploy", NETLIFY_ICON);
    this.addRibbonIcon("netlify-deploy", "Deploy presentation to Netlify", async () => {
      if (!this.settings.hasCompletedSetup) {
        new obsidian.Notice("Please complete the setup in the plugin settings first.");
        this.openSettings();
        return;
      }
      this.openDeploymentModal();
    });
    this.addSettingTab(new SlidesNetlifyDeployerSettingTab(this.app, this));
    this.netlifyService = new NetlifyService(
      this.settings,
      this.app,
      async (newSettings) => {
        console.log("Saving new settings:", newSettings);
        this.settings = { ...this.settings, ...newSettings };
        await this.saveSettings();
      }
    );
    this.slidesExporter = new SlidesExporter(this.app);
    this.addCommand({
      id: "deploy-current-presentation",
      name: "Deploy current presentation to Netlify",
      checkCallback: (checking) => {
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile || activeFile.extension !== "md") {
          return false;
        }
        if (checking) {
          return true;
        }
        this.openDeploymentModal();
        return true;
      }
    });
    console.log("Slides Netlify Deployer plugin loaded");
  }
  onunload() {
    if (this.settingsComponent) {
      this.settingsComponent.$destroy();
    }
    console.log("Slides Netlify Deployer plugin unloaded");
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    console.log("Loaded settings:", this.settings);
  }
  async saveSettings() {
    await this.saveData(this.settings);
    console.log("Saved settings:", this.settings);
    this.netlifyService = new NetlifyService(
      this.settings,
      this.app,
      async (newSettings) => {
        console.log("Saving new settings:", newSettings);
        this.settings = { ...this.settings, ...newSettings };
        await this.saveSettings();
      }
    );
  }
  openSettings() {
    this.app.setting.open();
    this.app.setting.openTab("advanced-slides-netlify-deployer");
  }
  openDeploymentModal() {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile || activeFile.extension !== "md") {
      new obsidian.Notice("Please open a markdown file first.");
      return;
    }
    this.netlifyService.clearDeploymentLogs();
    const modal = new CustomModal(this.app, this);
    modal.open();
  }
  // Used by the settings tab to render the Svelte component
  renderSettingsUI(containerEl) {
    if (this.settingsComponent) {
      this.settingsComponent.$destroy();
    }
    this.settingsComponent = new Settings({
      target: containerEl,
      props: {
        settings: this.settings,
        saveSettings: this.saveSettings.bind(this),
        netlifyService: this.netlifyService
      }
    });
  }
}
class SlidesNetlifyDeployerSettingTab extends obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    this.containerEl = containerEl;
    containerEl.empty();
    this.plugin.renderSettingsUI(containerEl);
  }
}
class CustomModal extends obsidian.Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
  }
  onOpen() {
    const { contentEl } = this;
    const activeFile = this.app.workspace.getActiveFile();
    this.deploymentComponent = new DeploymentModal({
      target: contentEl,
      props: {
        file: activeFile,
        settings: this.plugin.settings,
        netlifyService: this.plugin.netlifyService,
        slidesExporter: this.plugin.slidesExporter,
        saveSettings: this.plugin.saveSettings.bind(this.plugin),
        close: () => this.close()
      }
    });
  }
  onClose() {
    if (this.deploymentComponent) {
      this.deploymentComponent.$destroy();
    }
  }
}
module.exports = SlidesNetlifyDeployer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzLy5wbnBtL3N2ZWx0ZUAzLjU5LjIvbm9kZV9tb2R1bGVzL3N2ZWx0ZS9pbnRlcm5hbC9pbmRleC5tanMiLCJzcmMvY29tcG9uZW50cy9BdXRoRmxvdy5zdmVsdGUiLCJub2RlX21vZHVsZXMvLnBucG0vanN6aXBAMy4xMC4xL25vZGVfbW9kdWxlcy9qc3ppcC9kaXN0L2pzemlwLm1pbi5qcyIsInNyYy9zZXJ2aWNlcy9uZXRsaWZ5LXNlcnZpY2UudHMiLCJzcmMvY29tcG9uZW50cy9TZXR0aW5ncy5zdmVsdGUiLCJzcmMvY29tcG9uZW50cy9EZXBsb3ltZW50U3RhdHVzLnN2ZWx0ZSIsInNyYy9zZXJ2aWNlcy9zbGlkZXMtZXhwb3J0ZXIudHMiLCJzcmMvY29tcG9uZW50cy9EZXBsb3ltZW50TW9kYWwuc3ZlbHRlIiwic3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gbm9vcCgpIHsgfVxuY29uc3QgaWRlbnRpdHkgPSB4ID0+IHg7XG5mdW5jdGlvbiBhc3NpZ24odGFyLCBzcmMpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgZm9yIChjb25zdCBrIGluIHNyYylcbiAgICAgICAgdGFyW2tdID0gc3JjW2tdO1xuICAgIHJldHVybiB0YXI7XG59XG4vLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3RoZW4vaXMtcHJvbWlzZS9ibG9iL21hc3Rlci9pbmRleC5qc1xuLy8gRGlzdHJpYnV0ZWQgdW5kZXIgTUlUIExpY2Vuc2UgaHR0cHM6Ly9naXRodWIuY29tL3RoZW4vaXMtcHJvbWlzZS9ibG9iL21hc3Rlci9MSUNFTlNFXG5mdW5jdGlvbiBpc19wcm9taXNlKHZhbHVlKSB7XG4gICAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIGFkZF9sb2NhdGlvbihlbGVtZW50LCBmaWxlLCBsaW5lLCBjb2x1bW4sIGNoYXIpIHtcbiAgICBlbGVtZW50Ll9fc3ZlbHRlX21ldGEgPSB7XG4gICAgICAgIGxvYzogeyBmaWxlLCBsaW5lLCBjb2x1bW4sIGNoYXIgfVxuICAgIH07XG59XG5mdW5jdGlvbiBydW4oZm4pIHtcbiAgICByZXR1cm4gZm4oKTtcbn1cbmZ1bmN0aW9uIGJsYW5rX29iamVjdCgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShudWxsKTtcbn1cbmZ1bmN0aW9uIHJ1bl9hbGwoZm5zKSB7XG4gICAgZm5zLmZvckVhY2gocnVuKTtcbn1cbmZ1bmN0aW9uIGlzX2Z1bmN0aW9uKHRoaW5nKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGluZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIHNhZmVfbm90X2VxdWFsKGEsIGIpIHtcbiAgICByZXR1cm4gYSAhPSBhID8gYiA9PSBiIDogYSAhPT0gYiB8fCAoKGEgJiYgdHlwZW9mIGEgPT09ICdvYmplY3QnKSB8fCB0eXBlb2YgYSA9PT0gJ2Z1bmN0aW9uJyk7XG59XG5sZXQgc3JjX3VybF9lcXVhbF9hbmNob3I7XG5mdW5jdGlvbiBzcmNfdXJsX2VxdWFsKGVsZW1lbnRfc3JjLCB1cmwpIHtcbiAgICBpZiAoIXNyY191cmxfZXF1YWxfYW5jaG9yKSB7XG4gICAgICAgIHNyY191cmxfZXF1YWxfYW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIH1cbiAgICBzcmNfdXJsX2VxdWFsX2FuY2hvci5ocmVmID0gdXJsO1xuICAgIHJldHVybiBlbGVtZW50X3NyYyA9PT0gc3JjX3VybF9lcXVhbF9hbmNob3IuaHJlZjtcbn1cbmZ1bmN0aW9uIG5vdF9lcXVhbChhLCBiKSB7XG4gICAgcmV0dXJuIGEgIT0gYSA/IGIgPT0gYiA6IGEgIT09IGI7XG59XG5mdW5jdGlvbiBpc19lbXB0eShvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDA7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZV9zdG9yZShzdG9yZSwgbmFtZSkge1xuICAgIGlmIChzdG9yZSAhPSBudWxsICYmIHR5cGVvZiBzdG9yZS5zdWJzY3JpYmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAnJHtuYW1lfScgaXMgbm90IGEgc3RvcmUgd2l0aCBhICdzdWJzY3JpYmUnIG1ldGhvZGApO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHN1YnNjcmliZShzdG9yZSwgLi4uY2FsbGJhY2tzKSB7XG4gICAgaWYgKHN0b3JlID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgfVxuICAgIGNvbnN0IHVuc3ViID0gc3RvcmUuc3Vic2NyaWJlKC4uLmNhbGxiYWNrcyk7XG4gICAgcmV0dXJuIHVuc3ViLnVuc3Vic2NyaWJlID8gKCkgPT4gdW5zdWIudW5zdWJzY3JpYmUoKSA6IHVuc3ViO1xufVxuZnVuY3Rpb24gZ2V0X3N0b3JlX3ZhbHVlKHN0b3JlKSB7XG4gICAgbGV0IHZhbHVlO1xuICAgIHN1YnNjcmliZShzdG9yZSwgXyA9PiB2YWx1ZSA9IF8pKCk7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuZnVuY3Rpb24gY29tcG9uZW50X3N1YnNjcmliZShjb21wb25lbnQsIHN0b3JlLCBjYWxsYmFjaykge1xuICAgIGNvbXBvbmVudC4kJC5vbl9kZXN0cm95LnB1c2goc3Vic2NyaWJlKHN0b3JlLCBjYWxsYmFjaykpO1xufVxuZnVuY3Rpb24gY3JlYXRlX3Nsb3QoZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBmbikge1xuICAgIGlmIChkZWZpbml0aW9uKSB7XG4gICAgICAgIGNvbnN0IHNsb3RfY3R4ID0gZ2V0X3Nsb3RfY29udGV4dChkZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIGZuKTtcbiAgICAgICAgcmV0dXJuIGRlZmluaXRpb25bMF0oc2xvdF9jdHgpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldF9zbG90X2NvbnRleHQoZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBmbikge1xuICAgIHJldHVybiBkZWZpbml0aW9uWzFdICYmIGZuXG4gICAgICAgID8gYXNzaWduKCQkc2NvcGUuY3R4LnNsaWNlKCksIGRlZmluaXRpb25bMV0oZm4oY3R4KSkpXG4gICAgICAgIDogJCRzY29wZS5jdHg7XG59XG5mdW5jdGlvbiBnZXRfc2xvdF9jaGFuZ2VzKGRlZmluaXRpb24sICQkc2NvcGUsIGRpcnR5LCBmbikge1xuICAgIGlmIChkZWZpbml0aW9uWzJdICYmIGZuKSB7XG4gICAgICAgIGNvbnN0IGxldHMgPSBkZWZpbml0aW9uWzJdKGZuKGRpcnR5KSk7XG4gICAgICAgIGlmICgkJHNjb3BlLmRpcnR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBsZXRzO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgbGV0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGNvbnN0IG1lcmdlZCA9IFtdO1xuICAgICAgICAgICAgY29uc3QgbGVuID0gTWF0aC5tYXgoJCRzY29wZS5kaXJ0eS5sZW5ndGgsIGxldHMubGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBtZXJnZWRbaV0gPSAkJHNjb3BlLmRpcnR5W2ldIHwgbGV0c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtZXJnZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICQkc2NvcGUuZGlydHkgfCBsZXRzO1xuICAgIH1cbiAgICByZXR1cm4gJCRzY29wZS5kaXJ0eTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZV9zbG90X2Jhc2Uoc2xvdCwgc2xvdF9kZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIHNsb3RfY2hhbmdlcywgZ2V0X3Nsb3RfY29udGV4dF9mbikge1xuICAgIGlmIChzbG90X2NoYW5nZXMpIHtcbiAgICAgICAgY29uc3Qgc2xvdF9jb250ZXh0ID0gZ2V0X3Nsb3RfY29udGV4dChzbG90X2RlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZ2V0X3Nsb3RfY29udGV4dF9mbik7XG4gICAgICAgIHNsb3QucChzbG90X2NvbnRleHQsIHNsb3RfY2hhbmdlcyk7XG4gICAgfVxufVxuZnVuY3Rpb24gdXBkYXRlX3Nsb3Qoc2xvdCwgc2xvdF9kZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIGRpcnR5LCBnZXRfc2xvdF9jaGFuZ2VzX2ZuLCBnZXRfc2xvdF9jb250ZXh0X2ZuKSB7XG4gICAgY29uc3Qgc2xvdF9jaGFuZ2VzID0gZ2V0X3Nsb3RfY2hhbmdlcyhzbG90X2RlZmluaXRpb24sICQkc2NvcGUsIGRpcnR5LCBnZXRfc2xvdF9jaGFuZ2VzX2ZuKTtcbiAgICB1cGRhdGVfc2xvdF9iYXNlKHNsb3QsIHNsb3RfZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBzbG90X2NoYW5nZXMsIGdldF9zbG90X2NvbnRleHRfZm4pO1xufVxuZnVuY3Rpb24gZ2V0X2FsbF9kaXJ0eV9mcm9tX3Njb3BlKCQkc2NvcGUpIHtcbiAgICBpZiAoJCRzY29wZS5jdHgubGVuZ3RoID4gMzIpIHtcbiAgICAgICAgY29uc3QgZGlydHkgPSBbXTtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gJCRzY29wZS5jdHgubGVuZ3RoIC8gMzI7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGRpcnR5W2ldID0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpcnR5O1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG59XG5mdW5jdGlvbiBleGNsdWRlX2ludGVybmFsX3Byb3BzKHByb3BzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBrIGluIHByb3BzKVxuICAgICAgICBpZiAoa1swXSAhPT0gJyQnKVxuICAgICAgICAgICAgcmVzdWx0W2tdID0gcHJvcHNba107XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGNvbXB1dGVfcmVzdF9wcm9wcyhwcm9wcywga2V5cykge1xuICAgIGNvbnN0IHJlc3QgPSB7fTtcbiAgICBrZXlzID0gbmV3IFNldChrZXlzKTtcbiAgICBmb3IgKGNvbnN0IGsgaW4gcHJvcHMpXG4gICAgICAgIGlmICgha2V5cy5oYXMoaykgJiYga1swXSAhPT0gJyQnKVxuICAgICAgICAgICAgcmVzdFtrXSA9IHByb3BzW2tdO1xuICAgIHJldHVybiByZXN0O1xufVxuZnVuY3Rpb24gY29tcHV0ZV9zbG90cyhzbG90cykge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3Qga2V5IGluIHNsb3RzKSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG9uY2UoZm4pIHtcbiAgICBsZXQgcmFuID0gZmFsc2U7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgIGlmIChyYW4pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHJhbiA9IHRydWU7XG4gICAgICAgIGZuLmNhbGwodGhpcywgLi4uYXJncyk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIG51bGxfdG9fZW1wdHkodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWU7XG59XG5mdW5jdGlvbiBzZXRfc3RvcmVfdmFsdWUoc3RvcmUsIHJldCwgdmFsdWUpIHtcbiAgICBzdG9yZS5zZXQodmFsdWUpO1xuICAgIHJldHVybiByZXQ7XG59XG5jb25zdCBoYXNfcHJvcCA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xuZnVuY3Rpb24gYWN0aW9uX2Rlc3Ryb3llcihhY3Rpb25fcmVzdWx0KSB7XG4gICAgcmV0dXJuIGFjdGlvbl9yZXN1bHQgJiYgaXNfZnVuY3Rpb24oYWN0aW9uX3Jlc3VsdC5kZXN0cm95KSA/IGFjdGlvbl9yZXN1bHQuZGVzdHJveSA6IG5vb3A7XG59XG5mdW5jdGlvbiBzcGxpdF9jc3NfdW5pdCh2YWx1ZSkge1xuICAgIGNvbnN0IHNwbGl0ID0gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS5tYXRjaCgvXlxccyooLT9bXFxkLl0rKShbXlxcc10qKVxccyokLyk7XG4gICAgcmV0dXJuIHNwbGl0ID8gW3BhcnNlRmxvYXQoc3BsaXRbMV0pLCBzcGxpdFsyXSB8fCAncHgnXSA6IFt2YWx1ZSwgJ3B4J107XG59XG5jb25zdCBjb250ZW50ZWRpdGFibGVfdHJ1dGh5X3ZhbHVlcyA9IFsnJywgdHJ1ZSwgMSwgJ3RydWUnLCAnY29udGVudGVkaXRhYmxlJ107XG5cbmNvbnN0IGlzX2NsaWVudCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xubGV0IG5vdyA9IGlzX2NsaWVudFxuICAgID8gKCkgPT4gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpXG4gICAgOiAoKSA9PiBEYXRlLm5vdygpO1xubGV0IHJhZiA9IGlzX2NsaWVudCA/IGNiID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZShjYikgOiBub29wO1xuLy8gdXNlZCBpbnRlcm5hbGx5IGZvciB0ZXN0aW5nXG5mdW5jdGlvbiBzZXRfbm93KGZuKSB7XG4gICAgbm93ID0gZm47XG59XG5mdW5jdGlvbiBzZXRfcmFmKGZuKSB7XG4gICAgcmFmID0gZm47XG59XG5cbmNvbnN0IHRhc2tzID0gbmV3IFNldCgpO1xuZnVuY3Rpb24gcnVuX3Rhc2tzKG5vdykge1xuICAgIHRhc2tzLmZvckVhY2godGFzayA9PiB7XG4gICAgICAgIGlmICghdGFzay5jKG5vdykpIHtcbiAgICAgICAgICAgIHRhc2tzLmRlbGV0ZSh0YXNrKTtcbiAgICAgICAgICAgIHRhc2suZigpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHRhc2tzLnNpemUgIT09IDApXG4gICAgICAgIHJhZihydW5fdGFza3MpO1xufVxuLyoqXG4gKiBGb3IgdGVzdGluZyBwdXJwb3NlcyBvbmx5IVxuICovXG5mdW5jdGlvbiBjbGVhcl9sb29wcygpIHtcbiAgICB0YXNrcy5jbGVhcigpO1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHRhc2sgdGhhdCBydW5zIG9uIGVhY2ggcmFmIGZyYW1lXG4gKiB1bnRpbCBpdCByZXR1cm5zIGEgZmFsc3kgdmFsdWUgb3IgaXMgYWJvcnRlZFxuICovXG5mdW5jdGlvbiBsb29wKGNhbGxiYWNrKSB7XG4gICAgbGV0IHRhc2s7XG4gICAgaWYgKHRhc2tzLnNpemUgPT09IDApXG4gICAgICAgIHJhZihydW5fdGFza3MpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHByb21pc2U6IG5ldyBQcm9taXNlKGZ1bGZpbGwgPT4ge1xuICAgICAgICAgICAgdGFza3MuYWRkKHRhc2sgPSB7IGM6IGNhbGxiYWNrLCBmOiBmdWxmaWxsIH0pO1xuICAgICAgICB9KSxcbiAgICAgICAgYWJvcnQoKSB7XG4gICAgICAgICAgICB0YXNrcy5kZWxldGUodGFzayk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5jb25zdCBnbG9iYWxzID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgPyB3aW5kb3dcbiAgICA6IHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICA/IGdsb2JhbFRoaXNcbiAgICAgICAgOiBnbG9iYWwpO1xuXG4vKipcbiAqIFJlc2l6ZSBvYnNlcnZlciBzaW5nbGV0b24uXG4gKiBPbmUgbGlzdGVuZXIgcGVyIGVsZW1lbnQgb25seSFcbiAqIGh0dHBzOi8vZ3JvdXBzLmdvb2dsZS5jb20vYS9jaHJvbWl1bS5vcmcvZy9ibGluay1kZXYvYy96Nmllbk9OVWI1QS9tL0Y1LVZjVVp0QkFBSlxuICovXG5jbGFzcyBSZXNpemVPYnNlcnZlclNpbmdsZXRvbiB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLl9saXN0ZW5lcnMgPSAnV2Vha01hcCcgaW4gZ2xvYmFscyA/IG5ldyBXZWFrTWFwKCkgOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIG9ic2VydmUoZWxlbWVudCwgbGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnNldChlbGVtZW50LCBsaXN0ZW5lcik7XG4gICAgICAgIHRoaXMuX2dldE9ic2VydmVyKCkub2JzZXJ2ZShlbGVtZW50LCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzLmRlbGV0ZShlbGVtZW50KTtcbiAgICAgICAgICAgIHRoaXMuX29ic2VydmVyLnVub2JzZXJ2ZShlbGVtZW50KTsgLy8gdGhpcyBsaW5lIGNhbiBwcm9iYWJseSBiZSByZW1vdmVkXG4gICAgICAgIH07XG4gICAgfVxuICAgIF9nZXRPYnNlcnZlcigpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gKF9hID0gdGhpcy5fb2JzZXJ2ZXIpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6ICh0aGlzLl9vYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcigoZW50cmllcykgPT4ge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgICAgICAgICAgICAgUmVzaXplT2JzZXJ2ZXJTaW5nbGV0b24uZW50cmllcy5zZXQoZW50cnkudGFyZ2V0LCBlbnRyeSk7XG4gICAgICAgICAgICAgICAgKF9hID0gdGhpcy5fbGlzdGVuZXJzLmdldChlbnRyeS50YXJnZXQpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EoZW50cnkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgfVxufVxuLy8gTmVlZHMgdG8gYmUgd3JpdHRlbiBsaWtlIHRoaXMgdG8gcGFzcyB0aGUgdHJlZS1zaGFrZS10ZXN0XG5SZXNpemVPYnNlcnZlclNpbmdsZXRvbi5lbnRyaWVzID0gJ1dlYWtNYXAnIGluIGdsb2JhbHMgPyBuZXcgV2Vha01hcCgpIDogdW5kZWZpbmVkO1xuXG4vLyBUcmFjayB3aGljaCBub2RlcyBhcmUgY2xhaW1lZCBkdXJpbmcgaHlkcmF0aW9uLiBVbmNsYWltZWQgbm9kZXMgY2FuIHRoZW4gYmUgcmVtb3ZlZCBmcm9tIHRoZSBET01cbi8vIGF0IHRoZSBlbmQgb2YgaHlkcmF0aW9uIHdpdGhvdXQgdG91Y2hpbmcgdGhlIHJlbWFpbmluZyBub2Rlcy5cbmxldCBpc19oeWRyYXRpbmcgPSBmYWxzZTtcbmZ1bmN0aW9uIHN0YXJ0X2h5ZHJhdGluZygpIHtcbiAgICBpc19oeWRyYXRpbmcgPSB0cnVlO1xufVxuZnVuY3Rpb24gZW5kX2h5ZHJhdGluZygpIHtcbiAgICBpc19oeWRyYXRpbmcgPSBmYWxzZTtcbn1cbmZ1bmN0aW9uIHVwcGVyX2JvdW5kKGxvdywgaGlnaCwga2V5LCB2YWx1ZSkge1xuICAgIC8vIFJldHVybiBmaXJzdCBpbmRleCBvZiB2YWx1ZSBsYXJnZXIgdGhhbiBpbnB1dCB2YWx1ZSBpbiB0aGUgcmFuZ2UgW2xvdywgaGlnaClcbiAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgICBjb25zdCBtaWQgPSBsb3cgKyAoKGhpZ2ggLSBsb3cpID4+IDEpO1xuICAgICAgICBpZiAoa2V5KG1pZCkgPD0gdmFsdWUpIHtcbiAgICAgICAgICAgIGxvdyA9IG1pZCArIDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBoaWdoID0gbWlkO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsb3c7XG59XG5mdW5jdGlvbiBpbml0X2h5ZHJhdGUodGFyZ2V0KSB7XG4gICAgaWYgKHRhcmdldC5oeWRyYXRlX2luaXQpXG4gICAgICAgIHJldHVybjtcbiAgICB0YXJnZXQuaHlkcmF0ZV9pbml0ID0gdHJ1ZTtcbiAgICAvLyBXZSBrbm93IHRoYXQgYWxsIGNoaWxkcmVuIGhhdmUgY2xhaW1fb3JkZXIgdmFsdWVzIHNpbmNlIHRoZSB1bmNsYWltZWQgaGF2ZSBiZWVuIGRldGFjaGVkIGlmIHRhcmdldCBpcyBub3QgPGhlYWQ+XG4gICAgbGV0IGNoaWxkcmVuID0gdGFyZ2V0LmNoaWxkTm9kZXM7XG4gICAgLy8gSWYgdGFyZ2V0IGlzIDxoZWFkPiwgdGhlcmUgbWF5IGJlIGNoaWxkcmVuIHdpdGhvdXQgY2xhaW1fb3JkZXJcbiAgICBpZiAodGFyZ2V0Lm5vZGVOYW1lID09PSAnSEVBRCcpIHtcbiAgICAgICAgY29uc3QgbXlDaGlsZHJlbiA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gY2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAobm9kZS5jbGFpbV9vcmRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbXlDaGlsZHJlbi5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNoaWxkcmVuID0gbXlDaGlsZHJlbjtcbiAgICB9XG4gICAgLypcbiAgICAqIFJlb3JkZXIgY2xhaW1lZCBjaGlsZHJlbiBvcHRpbWFsbHkuXG4gICAgKiBXZSBjYW4gcmVvcmRlciBjbGFpbWVkIGNoaWxkcmVuIG9wdGltYWxseSBieSBmaW5kaW5nIHRoZSBsb25nZXN0IHN1YnNlcXVlbmNlIG9mXG4gICAgKiBub2RlcyB0aGF0IGFyZSBhbHJlYWR5IGNsYWltZWQgaW4gb3JkZXIgYW5kIG9ubHkgbW92aW5nIHRoZSByZXN0LiBUaGUgbG9uZ2VzdFxuICAgICogc3Vic2VxdWVuY2Ugb2Ygbm9kZXMgdGhhdCBhcmUgY2xhaW1lZCBpbiBvcmRlciBjYW4gYmUgZm91bmQgYnlcbiAgICAqIGNvbXB1dGluZyB0aGUgbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlIG9mIC5jbGFpbV9vcmRlciB2YWx1ZXMuXG4gICAgKlxuICAgICogVGhpcyBhbGdvcml0aG0gaXMgb3B0aW1hbCBpbiBnZW5lcmF0aW5nIHRoZSBsZWFzdCBhbW91bnQgb2YgcmVvcmRlciBvcGVyYXRpb25zXG4gICAgKiBwb3NzaWJsZS5cbiAgICAqXG4gICAgKiBQcm9vZjpcbiAgICAqIFdlIGtub3cgdGhhdCwgZ2l2ZW4gYSBzZXQgb2YgcmVvcmRlcmluZyBvcGVyYXRpb25zLCB0aGUgbm9kZXMgdGhhdCBkbyBub3QgbW92ZVxuICAgICogYWx3YXlzIGZvcm0gYW4gaW5jcmVhc2luZyBzdWJzZXF1ZW5jZSwgc2luY2UgdGhleSBkbyBub3QgbW92ZSBhbW9uZyBlYWNoIG90aGVyXG4gICAgKiBtZWFuaW5nIHRoYXQgdGhleSBtdXN0IGJlIGFscmVhZHkgb3JkZXJlZCBhbW9uZyBlYWNoIG90aGVyLiBUaHVzLCB0aGUgbWF4aW1hbFxuICAgICogc2V0IG9mIG5vZGVzIHRoYXQgZG8gbm90IG1vdmUgZm9ybSBhIGxvbmdlc3QgaW5jcmVhc2luZyBzdWJzZXF1ZW5jZS5cbiAgICAqL1xuICAgIC8vIENvbXB1dGUgbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlXG4gICAgLy8gbTogc3Vic2VxdWVuY2UgbGVuZ3RoIGogPT4gaW5kZXggayBvZiBzbWFsbGVzdCB2YWx1ZSB0aGF0IGVuZHMgYW4gaW5jcmVhc2luZyBzdWJzZXF1ZW5jZSBvZiBsZW5ndGggalxuICAgIGNvbnN0IG0gPSBuZXcgSW50MzJBcnJheShjaGlsZHJlbi5sZW5ndGggKyAxKTtcbiAgICAvLyBQcmVkZWNlc3NvciBpbmRpY2VzICsgMVxuICAgIGNvbnN0IHAgPSBuZXcgSW50MzJBcnJheShjaGlsZHJlbi5sZW5ndGgpO1xuICAgIG1bMF0gPSAtMTtcbiAgICBsZXQgbG9uZ2VzdCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjdXJyZW50ID0gY2hpbGRyZW5baV0uY2xhaW1fb3JkZXI7XG4gICAgICAgIC8vIEZpbmQgdGhlIGxhcmdlc3Qgc3Vic2VxdWVuY2UgbGVuZ3RoIHN1Y2ggdGhhdCBpdCBlbmRzIGluIGEgdmFsdWUgbGVzcyB0aGFuIG91ciBjdXJyZW50IHZhbHVlXG4gICAgICAgIC8vIHVwcGVyX2JvdW5kIHJldHVybnMgZmlyc3QgZ3JlYXRlciB2YWx1ZSwgc28gd2Ugc3VidHJhY3Qgb25lXG4gICAgICAgIC8vIHdpdGggZmFzdCBwYXRoIGZvciB3aGVuIHdlIGFyZSBvbiB0aGUgY3VycmVudCBsb25nZXN0IHN1YnNlcXVlbmNlXG4gICAgICAgIGNvbnN0IHNlcUxlbiA9ICgobG9uZ2VzdCA+IDAgJiYgY2hpbGRyZW5bbVtsb25nZXN0XV0uY2xhaW1fb3JkZXIgPD0gY3VycmVudCkgPyBsb25nZXN0ICsgMSA6IHVwcGVyX2JvdW5kKDEsIGxvbmdlc3QsIGlkeCA9PiBjaGlsZHJlblttW2lkeF1dLmNsYWltX29yZGVyLCBjdXJyZW50KSkgLSAxO1xuICAgICAgICBwW2ldID0gbVtzZXFMZW5dICsgMTtcbiAgICAgICAgY29uc3QgbmV3TGVuID0gc2VxTGVuICsgMTtcbiAgICAgICAgLy8gV2UgY2FuIGd1YXJhbnRlZSB0aGF0IGN1cnJlbnQgaXMgdGhlIHNtYWxsZXN0IHZhbHVlLiBPdGhlcndpc2UsIHdlIHdvdWxkIGhhdmUgZ2VuZXJhdGVkIGEgbG9uZ2VyIHNlcXVlbmNlLlxuICAgICAgICBtW25ld0xlbl0gPSBpO1xuICAgICAgICBsb25nZXN0ID0gTWF0aC5tYXgobmV3TGVuLCBsb25nZXN0KTtcbiAgICB9XG4gICAgLy8gVGhlIGxvbmdlc3QgaW5jcmVhc2luZyBzdWJzZXF1ZW5jZSBvZiBub2RlcyAoaW5pdGlhbGx5IHJldmVyc2VkKVxuICAgIGNvbnN0IGxpcyA9IFtdO1xuICAgIC8vIFRoZSByZXN0IG9mIHRoZSBub2Rlcywgbm9kZXMgdGhhdCB3aWxsIGJlIG1vdmVkXG4gICAgY29uc3QgdG9Nb3ZlID0gW107XG4gICAgbGV0IGxhc3QgPSBjaGlsZHJlbi5sZW5ndGggLSAxO1xuICAgIGZvciAobGV0IGN1ciA9IG1bbG9uZ2VzdF0gKyAxOyBjdXIgIT0gMDsgY3VyID0gcFtjdXIgLSAxXSkge1xuICAgICAgICBsaXMucHVzaChjaGlsZHJlbltjdXIgLSAxXSk7XG4gICAgICAgIGZvciAoOyBsYXN0ID49IGN1cjsgbGFzdC0tKSB7XG4gICAgICAgICAgICB0b01vdmUucHVzaChjaGlsZHJlbltsYXN0XSk7XG4gICAgICAgIH1cbiAgICAgICAgbGFzdC0tO1xuICAgIH1cbiAgICBmb3IgKDsgbGFzdCA+PSAwOyBsYXN0LS0pIHtcbiAgICAgICAgdG9Nb3ZlLnB1c2goY2hpbGRyZW5bbGFzdF0pO1xuICAgIH1cbiAgICBsaXMucmV2ZXJzZSgpO1xuICAgIC8vIFdlIHNvcnQgdGhlIG5vZGVzIGJlaW5nIG1vdmVkIHRvIGd1YXJhbnRlZSB0aGF0IHRoZWlyIGluc2VydGlvbiBvcmRlciBtYXRjaGVzIHRoZSBjbGFpbSBvcmRlclxuICAgIHRvTW92ZS5zb3J0KChhLCBiKSA9PiBhLmNsYWltX29yZGVyIC0gYi5jbGFpbV9vcmRlcik7XG4gICAgLy8gRmluYWxseSwgd2UgbW92ZSB0aGUgbm9kZXNcbiAgICBmb3IgKGxldCBpID0gMCwgaiA9IDA7IGkgPCB0b01vdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgd2hpbGUgKGogPCBsaXMubGVuZ3RoICYmIHRvTW92ZVtpXS5jbGFpbV9vcmRlciA+PSBsaXNbal0uY2xhaW1fb3JkZXIpIHtcbiAgICAgICAgICAgIGorKztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhbmNob3IgPSBqIDwgbGlzLmxlbmd0aCA/IGxpc1tqXSA6IG51bGw7XG4gICAgICAgIHRhcmdldC5pbnNlcnRCZWZvcmUodG9Nb3ZlW2ldLCBhbmNob3IpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGFwcGVuZCh0YXJnZXQsIG5vZGUpIHtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQobm9kZSk7XG59XG5mdW5jdGlvbiBhcHBlbmRfc3R5bGVzKHRhcmdldCwgc3R5bGVfc2hlZXRfaWQsIHN0eWxlcykge1xuICAgIGNvbnN0IGFwcGVuZF9zdHlsZXNfdG8gPSBnZXRfcm9vdF9mb3Jfc3R5bGUodGFyZ2V0KTtcbiAgICBpZiAoIWFwcGVuZF9zdHlsZXNfdG8uZ2V0RWxlbWVudEJ5SWQoc3R5bGVfc2hlZXRfaWQpKSB7XG4gICAgICAgIGNvbnN0IHN0eWxlID0gZWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgc3R5bGUuaWQgPSBzdHlsZV9zaGVldF9pZDtcbiAgICAgICAgc3R5bGUudGV4dENvbnRlbnQgPSBzdHlsZXM7XG4gICAgICAgIGFwcGVuZF9zdHlsZXNoZWV0KGFwcGVuZF9zdHlsZXNfdG8sIHN0eWxlKTtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXRfcm9vdF9mb3Jfc3R5bGUobm9kZSkge1xuICAgIGlmICghbm9kZSlcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50O1xuICAgIGNvbnN0IHJvb3QgPSBub2RlLmdldFJvb3ROb2RlID8gbm9kZS5nZXRSb290Tm9kZSgpIDogbm9kZS5vd25lckRvY3VtZW50O1xuICAgIGlmIChyb290ICYmIHJvb3QuaG9zdCkge1xuICAgICAgICByZXR1cm4gcm9vdDtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGUub3duZXJEb2N1bWVudDtcbn1cbmZ1bmN0aW9uIGFwcGVuZF9lbXB0eV9zdHlsZXNoZWV0KG5vZGUpIHtcbiAgICBjb25zdCBzdHlsZV9lbGVtZW50ID0gZWxlbWVudCgnc3R5bGUnKTtcbiAgICBhcHBlbmRfc3R5bGVzaGVldChnZXRfcm9vdF9mb3Jfc3R5bGUobm9kZSksIHN0eWxlX2VsZW1lbnQpO1xuICAgIHJldHVybiBzdHlsZV9lbGVtZW50LnNoZWV0O1xufVxuZnVuY3Rpb24gYXBwZW5kX3N0eWxlc2hlZXQobm9kZSwgc3R5bGUpIHtcbiAgICBhcHBlbmQobm9kZS5oZWFkIHx8IG5vZGUsIHN0eWxlKTtcbiAgICByZXR1cm4gc3R5bGUuc2hlZXQ7XG59XG5mdW5jdGlvbiBhcHBlbmRfaHlkcmF0aW9uKHRhcmdldCwgbm9kZSkge1xuICAgIGlmIChpc19oeWRyYXRpbmcpIHtcbiAgICAgICAgaW5pdF9oeWRyYXRlKHRhcmdldCk7XG4gICAgICAgIGlmICgodGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQgPT09IHVuZGVmaW5lZCkgfHwgKCh0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZCAhPT0gbnVsbCkgJiYgKHRhcmdldC5hY3R1YWxfZW5kX2NoaWxkLnBhcmVudE5vZGUgIT09IHRhcmdldCkpKSB7XG4gICAgICAgICAgICB0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZCA9IHRhcmdldC5maXJzdENoaWxkO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNraXAgbm9kZXMgb2YgdW5kZWZpbmVkIG9yZGVyaW5nXG4gICAgICAgIHdoaWxlICgodGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQgIT09IG51bGwpICYmICh0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZC5jbGFpbV9vcmRlciA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgdGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQgPSB0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZSAhPT0gdGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQpIHtcbiAgICAgICAgICAgIC8vIFdlIG9ubHkgaW5zZXJ0IGlmIHRoZSBvcmRlcmluZyBvZiB0aGlzIG5vZGUgc2hvdWxkIGJlIG1vZGlmaWVkIG9yIHRoZSBwYXJlbnQgbm9kZSBpcyBub3QgdGFyZ2V0XG4gICAgICAgICAgICBpZiAobm9kZS5jbGFpbV9vcmRlciAhPT0gdW5kZWZpbmVkIHx8IG5vZGUucGFyZW50Tm9kZSAhPT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0Lmluc2VydEJlZm9yZShub2RlLCB0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZCA9IG5vZGUubmV4dFNpYmxpbmc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAobm9kZS5wYXJlbnROb2RlICE9PSB0YXJnZXQgfHwgbm9kZS5uZXh0U2libGluZyAhPT0gbnVsbCkge1xuICAgICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgfVxufVxuZnVuY3Rpb24gaW5zZXJ0KHRhcmdldCwgbm9kZSwgYW5jaG9yKSB7XG4gICAgdGFyZ2V0Lmluc2VydEJlZm9yZShub2RlLCBhbmNob3IgfHwgbnVsbCk7XG59XG5mdW5jdGlvbiBpbnNlcnRfaHlkcmF0aW9uKHRhcmdldCwgbm9kZSwgYW5jaG9yKSB7XG4gICAgaWYgKGlzX2h5ZHJhdGluZyAmJiAhYW5jaG9yKSB7XG4gICAgICAgIGFwcGVuZF9oeWRyYXRpb24odGFyZ2V0LCBub2RlKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobm9kZS5wYXJlbnROb2RlICE9PSB0YXJnZXQgfHwgbm9kZS5uZXh0U2libGluZyAhPSBhbmNob3IpIHtcbiAgICAgICAgdGFyZ2V0Lmluc2VydEJlZm9yZShub2RlLCBhbmNob3IgfHwgbnVsbCk7XG4gICAgfVxufVxuZnVuY3Rpb24gZGV0YWNoKG5vZGUpIHtcbiAgICBpZiAobm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICB9XG59XG5mdW5jdGlvbiBkZXN0cm95X2VhY2goaXRlcmF0aW9ucywgZGV0YWNoaW5nKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVyYXRpb25zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmIChpdGVyYXRpb25zW2ldKVxuICAgICAgICAgICAgaXRlcmF0aW9uc1tpXS5kKGRldGFjaGluZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZWxlbWVudChuYW1lKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSk7XG59XG5mdW5jdGlvbiBlbGVtZW50X2lzKG5hbWUsIGlzKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSwgeyBpcyB9KTtcbn1cbmZ1bmN0aW9uIG9iamVjdF93aXRob3V0X3Byb3BlcnRpZXMob2JqLCBleGNsdWRlKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0ge307XG4gICAgZm9yIChjb25zdCBrIGluIG9iaikge1xuICAgICAgICBpZiAoaGFzX3Byb3Aob2JqLCBrKVxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgJiYgZXhjbHVkZS5pbmRleE9mKGspID09PSAtMSkge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgdGFyZ2V0W2tdID0gb2JqW2tdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG59XG5mdW5jdGlvbiBzdmdfZWxlbWVudChuYW1lKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBuYW1lKTtcbn1cbmZ1bmN0aW9uIHRleHQoZGF0YSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkYXRhKTtcbn1cbmZ1bmN0aW9uIHNwYWNlKCkge1xuICAgIHJldHVybiB0ZXh0KCcgJyk7XG59XG5mdW5jdGlvbiBlbXB0eSgpIHtcbiAgICByZXR1cm4gdGV4dCgnJyk7XG59XG5mdW5jdGlvbiBjb21tZW50KGNvbnRlbnQpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChjb250ZW50KTtcbn1cbmZ1bmN0aW9uIGxpc3Rlbihub2RlLCBldmVudCwgaGFuZGxlciwgb3B0aW9ucykge1xuICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuICgpID0+IG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG59XG5mdW5jdGlvbiBwcmV2ZW50X2RlZmF1bHQoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH07XG59XG5mdW5jdGlvbiBzdG9wX3Byb3BhZ2F0aW9uKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHN0b3BfaW1tZWRpYXRlX3Byb3BhZ2F0aW9uKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHNlbGYoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gdGhpcylcbiAgICAgICAgICAgIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH07XG59XG5mdW5jdGlvbiB0cnVzdGVkKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGlmIChldmVudC5pc1RydXN0ZWQpXG4gICAgICAgICAgICBmbi5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICB9O1xufVxuZnVuY3Rpb24gYXR0cihub2RlLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG4gICAgZWxzZSBpZiAobm9kZS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKSAhPT0gdmFsdWUpXG4gICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgdmFsdWUpO1xufVxuLyoqXG4gKiBMaXN0IG9mIGF0dHJpYnV0ZXMgdGhhdCBzaG91bGQgYWx3YXlzIGJlIHNldCB0aHJvdWdoIHRoZSBhdHRyIG1ldGhvZCxcbiAqIGJlY2F1c2UgdXBkYXRpbmcgdGhlbSB0aHJvdWdoIHRoZSBwcm9wZXJ0eSBzZXR0ZXIgZG9lc24ndCB3b3JrIHJlbGlhYmx5LlxuICogSW4gdGhlIGV4YW1wbGUgb2YgYHdpZHRoYC9gaGVpZ2h0YCwgdGhlIHByb2JsZW0gaXMgdGhhdCB0aGUgc2V0dGVyIG9ubHlcbiAqIGFjY2VwdHMgbnVtZXJpYyB2YWx1ZXMsIGJ1dCB0aGUgYXR0cmlidXRlIGNhbiBhbHNvIGJlIHNldCB0byBhIHN0cmluZyBsaWtlIGA1MCVgLlxuICogSWYgdGhpcyBsaXN0IGJlY29tZXMgdG9vIGJpZywgcmV0aGluayB0aGlzIGFwcHJvYWNoLlxuICovXG5jb25zdCBhbHdheXNfc2V0X3Rocm91Z2hfc2V0X2F0dHJpYnV0ZSA9IFsnd2lkdGgnLCAnaGVpZ2h0J107XG5mdW5jdGlvbiBzZXRfYXR0cmlidXRlcyhub2RlLCBhdHRyaWJ1dGVzKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGRlc2NyaXB0b3JzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMobm9kZS5fX3Byb3RvX18pO1xuICAgIGZvciAoY29uc3Qga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXNba2V5XSA9PSBudWxsKSB7XG4gICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGtleSA9PT0gJ3N0eWxlJykge1xuICAgICAgICAgICAgbm9kZS5zdHlsZS5jc3NUZXh0ID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGtleSA9PT0gJ19fdmFsdWUnKSB7XG4gICAgICAgICAgICBub2RlLnZhbHVlID0gbm9kZVtrZXldID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRlc2NyaXB0b3JzW2tleV0gJiYgZGVzY3JpcHRvcnNba2V5XS5zZXQgJiYgYWx3YXlzX3NldF90aHJvdWdoX3NldF9hdHRyaWJ1dGUuaW5kZXhPZihrZXkpID09PSAtMSkge1xuICAgICAgICAgICAgbm9kZVtrZXldID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXR0cihub2RlLCBrZXksIGF0dHJpYnV0ZXNba2V5XSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfc3ZnX2F0dHJpYnV0ZXMobm9kZSwgYXR0cmlidXRlcykge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgYXR0cihub2RlLCBrZXksIGF0dHJpYnV0ZXNba2V5XSk7XG4gICAgfVxufVxuZnVuY3Rpb24gc2V0X2N1c3RvbV9lbGVtZW50X2RhdGFfbWFwKG5vZGUsIGRhdGFfbWFwKSB7XG4gICAgT2JqZWN0LmtleXMoZGF0YV9tYXApLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBzZXRfY3VzdG9tX2VsZW1lbnRfZGF0YShub2RlLCBrZXksIGRhdGFfbWFwW2tleV0pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gc2V0X2N1c3RvbV9lbGVtZW50X2RhdGEobm9kZSwgcHJvcCwgdmFsdWUpIHtcbiAgICBpZiAocHJvcCBpbiBub2RlKSB7XG4gICAgICAgIG5vZGVbcHJvcF0gPSB0eXBlb2Ygbm9kZVtwcm9wXSA9PT0gJ2Jvb2xlYW4nICYmIHZhbHVlID09PSAnJyA/IHRydWUgOiB2YWx1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGF0dHIobm9kZSwgcHJvcCwgdmFsdWUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNldF9keW5hbWljX2VsZW1lbnRfZGF0YSh0YWcpIHtcbiAgICByZXR1cm4gKC8tLy50ZXN0KHRhZykpID8gc2V0X2N1c3RvbV9lbGVtZW50X2RhdGFfbWFwIDogc2V0X2F0dHJpYnV0ZXM7XG59XG5mdW5jdGlvbiB4bGlua19hdHRyKG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICBub2RlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgYXR0cmlidXRlLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBnZXRfYmluZGluZ19ncm91cF92YWx1ZShncm91cCwgX192YWx1ZSwgY2hlY2tlZCkge1xuICAgIGNvbnN0IHZhbHVlID0gbmV3IFNldCgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXAubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGdyb3VwW2ldLmNoZWNrZWQpXG4gICAgICAgICAgICB2YWx1ZS5hZGQoZ3JvdXBbaV0uX192YWx1ZSk7XG4gICAgfVxuICAgIGlmICghY2hlY2tlZCkge1xuICAgICAgICB2YWx1ZS5kZWxldGUoX192YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBBcnJheS5mcm9tKHZhbHVlKTtcbn1cbmZ1bmN0aW9uIGluaXRfYmluZGluZ19ncm91cChncm91cCkge1xuICAgIGxldCBfaW5wdXRzO1xuICAgIHJldHVybiB7XG4gICAgICAgIC8qIHB1c2ggKi8gcCguLi5pbnB1dHMpIHtcbiAgICAgICAgICAgIF9pbnB1dHMgPSBpbnB1dHM7XG4gICAgICAgICAgICBfaW5wdXRzLmZvckVhY2goaW5wdXQgPT4gZ3JvdXAucHVzaChpbnB1dCkpO1xuICAgICAgICB9LFxuICAgICAgICAvKiByZW1vdmUgKi8gcigpIHtcbiAgICAgICAgICAgIF9pbnB1dHMuZm9yRWFjaChpbnB1dCA9PiBncm91cC5zcGxpY2UoZ3JvdXAuaW5kZXhPZihpbnB1dCksIDEpKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiBpbml0X2JpbmRpbmdfZ3JvdXBfZHluYW1pYyhncm91cCwgaW5kZXhlcykge1xuICAgIGxldCBfZ3JvdXAgPSBnZXRfYmluZGluZ19ncm91cChncm91cCk7XG4gICAgbGV0IF9pbnB1dHM7XG4gICAgZnVuY3Rpb24gZ2V0X2JpbmRpbmdfZ3JvdXAoZ3JvdXApIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBncm91cCA9IGdyb3VwW2luZGV4ZXNbaV1dID0gZ3JvdXBbaW5kZXhlc1tpXV0gfHwgW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdyb3VwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwdXNoKCkge1xuICAgICAgICBfaW5wdXRzLmZvckVhY2goaW5wdXQgPT4gX2dyb3VwLnB1c2goaW5wdXQpKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgICBfaW5wdXRzLmZvckVhY2goaW5wdXQgPT4gX2dyb3VwLnNwbGljZShfZ3JvdXAuaW5kZXhPZihpbnB1dCksIDEpKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgLyogdXBkYXRlICovIHUobmV3X2luZGV4ZXMpIHtcbiAgICAgICAgICAgIGluZGV4ZXMgPSBuZXdfaW5kZXhlcztcbiAgICAgICAgICAgIGNvbnN0IG5ld19ncm91cCA9IGdldF9iaW5kaW5nX2dyb3VwKGdyb3VwKTtcbiAgICAgICAgICAgIGlmIChuZXdfZ3JvdXAgIT09IF9ncm91cCkge1xuICAgICAgICAgICAgICAgIHJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIF9ncm91cCA9IG5ld19ncm91cDtcbiAgICAgICAgICAgICAgICBwdXNoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8qIHB1c2ggKi8gcCguLi5pbnB1dHMpIHtcbiAgICAgICAgICAgIF9pbnB1dHMgPSBpbnB1dHM7XG4gICAgICAgICAgICBwdXNoKCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qIHJlbW92ZSAqLyByOiByZW1vdmVcbiAgICB9O1xufVxuZnVuY3Rpb24gdG9fbnVtYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAnJyA/IG51bGwgOiArdmFsdWU7XG59XG5mdW5jdGlvbiB0aW1lX3Jhbmdlc190b19hcnJheShyYW5nZXMpIHtcbiAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmFuZ2VzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGFycmF5LnB1c2goeyBzdGFydDogcmFuZ2VzLnN0YXJ0KGkpLCBlbmQ6IHJhbmdlcy5lbmQoaSkgfSk7XG4gICAgfVxuICAgIHJldHVybiBhcnJheTtcbn1cbmZ1bmN0aW9uIGNoaWxkcmVuKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShlbGVtZW50LmNoaWxkTm9kZXMpO1xufVxuZnVuY3Rpb24gaW5pdF9jbGFpbV9pbmZvKG5vZGVzKSB7XG4gICAgaWYgKG5vZGVzLmNsYWltX2luZm8gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBub2Rlcy5jbGFpbV9pbmZvID0geyBsYXN0X2luZGV4OiAwLCB0b3RhbF9jbGFpbWVkOiAwIH07XG4gICAgfVxufVxuZnVuY3Rpb24gY2xhaW1fbm9kZShub2RlcywgcHJlZGljYXRlLCBwcm9jZXNzTm9kZSwgY3JlYXRlTm9kZSwgZG9udFVwZGF0ZUxhc3RJbmRleCA9IGZhbHNlKSB7XG4gICAgLy8gVHJ5IHRvIGZpbmQgbm9kZXMgaW4gYW4gb3JkZXIgc3VjaCB0aGF0IHdlIGxlbmd0aGVuIHRoZSBsb25nZXN0IGluY3JlYXNpbmcgc3Vic2VxdWVuY2VcbiAgICBpbml0X2NsYWltX2luZm8obm9kZXMpO1xuICAgIGNvbnN0IHJlc3VsdE5vZGUgPSAoKCkgPT4ge1xuICAgICAgICAvLyBXZSBmaXJzdCB0cnkgdG8gZmluZCBhbiBlbGVtZW50IGFmdGVyIHRoZSBwcmV2aW91cyBvbmVcbiAgICAgICAgZm9yIChsZXQgaSA9IG5vZGVzLmNsYWltX2luZm8ubGFzdF9pbmRleDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbaV07XG4gICAgICAgICAgICBpZiAocHJlZGljYXRlKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVwbGFjZW1lbnQgPSBwcm9jZXNzTm9kZShub2RlKTtcbiAgICAgICAgICAgICAgICBpZiAocmVwbGFjZW1lbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBub2Rlcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBub2Rlc1tpXSA9IHJlcGxhY2VtZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWRvbnRVcGRhdGVMYXN0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZXMuY2xhaW1faW5mby5sYXN0X2luZGV4ID0gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSB0cnkgdG8gZmluZCBvbmUgYmVmb3JlXG4gICAgICAgIC8vIFdlIGl0ZXJhdGUgaW4gcmV2ZXJzZSBzbyB0aGF0IHdlIGRvbid0IGdvIHRvbyBmYXIgYmFja1xuICAgICAgICBmb3IgKGxldCBpID0gbm9kZXMuY2xhaW1faW5mby5sYXN0X2luZGV4IC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgICAgIGlmIChwcmVkaWNhdGUobm9kZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXBsYWNlbWVudCA9IHByb2Nlc3NOb2RlKG5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChyZXBsYWNlbWVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVzW2ldID0gcmVwbGFjZW1lbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghZG9udFVwZGF0ZUxhc3RJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBub2Rlcy5jbGFpbV9pbmZvLmxhc3RfaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChyZXBsYWNlbWVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIHdlIHNwbGljZWQgYmVmb3JlIHRoZSBsYXN0X2luZGV4LCB3ZSBkZWNyZWFzZSBpdFxuICAgICAgICAgICAgICAgICAgICBub2Rlcy5jbGFpbV9pbmZvLmxhc3RfaW5kZXgtLTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgd2UgY2FuJ3QgZmluZCBhbnkgbWF0Y2hpbmcgbm9kZSwgd2UgY3JlYXRlIGEgbmV3IG9uZVxuICAgICAgICByZXR1cm4gY3JlYXRlTm9kZSgpO1xuICAgIH0pKCk7XG4gICAgcmVzdWx0Tm9kZS5jbGFpbV9vcmRlciA9IG5vZGVzLmNsYWltX2luZm8udG90YWxfY2xhaW1lZDtcbiAgICBub2Rlcy5jbGFpbV9pbmZvLnRvdGFsX2NsYWltZWQgKz0gMTtcbiAgICByZXR1cm4gcmVzdWx0Tm9kZTtcbn1cbmZ1bmN0aW9uIGNsYWltX2VsZW1lbnRfYmFzZShub2RlcywgbmFtZSwgYXR0cmlidXRlcywgY3JlYXRlX2VsZW1lbnQpIHtcbiAgICByZXR1cm4gY2xhaW1fbm9kZShub2RlcywgKG5vZGUpID0+IG5vZGUubm9kZU5hbWUgPT09IG5hbWUsIChub2RlKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbW92ZSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUuYXR0cmlidXRlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlID0gbm9kZS5hdHRyaWJ1dGVzW2pdO1xuICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZS5uYW1lXSkge1xuICAgICAgICAgICAgICAgIHJlbW92ZS5wdXNoKGF0dHJpYnV0ZS5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZW1vdmUuZm9yRWFjaCh2ID0+IG5vZGUucmVtb3ZlQXR0cmlidXRlKHYpKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9LCAoKSA9PiBjcmVhdGVfZWxlbWVudChuYW1lKSk7XG59XG5mdW5jdGlvbiBjbGFpbV9lbGVtZW50KG5vZGVzLCBuYW1lLCBhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIGNsYWltX2VsZW1lbnRfYmFzZShub2RlcywgbmFtZSwgYXR0cmlidXRlcywgZWxlbWVudCk7XG59XG5mdW5jdGlvbiBjbGFpbV9zdmdfZWxlbWVudChub2RlcywgbmFtZSwgYXR0cmlidXRlcykge1xuICAgIHJldHVybiBjbGFpbV9lbGVtZW50X2Jhc2Uobm9kZXMsIG5hbWUsIGF0dHJpYnV0ZXMsIHN2Z19lbGVtZW50KTtcbn1cbmZ1bmN0aW9uIGNsYWltX3RleHQobm9kZXMsIGRhdGEpIHtcbiAgICByZXR1cm4gY2xhaW1fbm9kZShub2RlcywgKG5vZGUpID0+IG5vZGUubm9kZVR5cGUgPT09IDMsIChub2RlKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGFTdHIgPSAnJyArIGRhdGE7XG4gICAgICAgIGlmIChub2RlLmRhdGEuc3RhcnRzV2l0aChkYXRhU3RyKSkge1xuICAgICAgICAgICAgaWYgKG5vZGUuZGF0YS5sZW5ndGggIT09IGRhdGFTdHIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUuc3BsaXRUZXh0KGRhdGFTdHIubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuZGF0YSA9IGRhdGFTdHI7XG4gICAgICAgIH1cbiAgICB9LCAoKSA9PiB0ZXh0KGRhdGEpLCB0cnVlIC8vIFRleHQgbm9kZXMgc2hvdWxkIG5vdCB1cGRhdGUgbGFzdCBpbmRleCBzaW5jZSBpdCBpcyBsaWtlbHkgbm90IHdvcnRoIGl0IHRvIGVsaW1pbmF0ZSBhbiBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlIG9mIGFjdHVhbCBlbGVtZW50c1xuICAgICk7XG59XG5mdW5jdGlvbiBjbGFpbV9zcGFjZShub2Rlcykge1xuICAgIHJldHVybiBjbGFpbV90ZXh0KG5vZGVzLCAnICcpO1xufVxuZnVuY3Rpb24gY2xhaW1fY29tbWVudChub2RlcywgZGF0YSkge1xuICAgIHJldHVybiBjbGFpbV9ub2RlKG5vZGVzLCAobm9kZSkgPT4gbm9kZS5ub2RlVHlwZSA9PT0gOCwgKG5vZGUpID0+IHtcbiAgICAgICAgbm9kZS5kYXRhID0gJycgKyBkYXRhO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0sICgpID0+IGNvbW1lbnQoZGF0YSksIHRydWUpO1xufVxuZnVuY3Rpb24gZmluZF9jb21tZW50KG5vZGVzLCB0ZXh0LCBzdGFydCkge1xuICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IG5vZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDggLyogY29tbWVudCBub2RlICovICYmIG5vZGUudGV4dENvbnRlbnQudHJpbSgpID09PSB0ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9kZXMubGVuZ3RoO1xufVxuZnVuY3Rpb24gY2xhaW1faHRtbF90YWcobm9kZXMsIGlzX3N2Zykge1xuICAgIC8vIGZpbmQgaHRtbCBvcGVuaW5nIHRhZ1xuICAgIGNvbnN0IHN0YXJ0X2luZGV4ID0gZmluZF9jb21tZW50KG5vZGVzLCAnSFRNTF9UQUdfU1RBUlQnLCAwKTtcbiAgICBjb25zdCBlbmRfaW5kZXggPSBmaW5kX2NvbW1lbnQobm9kZXMsICdIVE1MX1RBR19FTkQnLCBzdGFydF9pbmRleCk7XG4gICAgaWYgKHN0YXJ0X2luZGV4ID09PSBlbmRfaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBIdG1sVGFnSHlkcmF0aW9uKHVuZGVmaW5lZCwgaXNfc3ZnKTtcbiAgICB9XG4gICAgaW5pdF9jbGFpbV9pbmZvKG5vZGVzKTtcbiAgICBjb25zdCBodG1sX3RhZ19ub2RlcyA9IG5vZGVzLnNwbGljZShzdGFydF9pbmRleCwgZW5kX2luZGV4IC0gc3RhcnRfaW5kZXggKyAxKTtcbiAgICBkZXRhY2goaHRtbF90YWdfbm9kZXNbMF0pO1xuICAgIGRldGFjaChodG1sX3RhZ19ub2Rlc1todG1sX3RhZ19ub2Rlcy5sZW5ndGggLSAxXSk7XG4gICAgY29uc3QgY2xhaW1lZF9ub2RlcyA9IGh0bWxfdGFnX25vZGVzLnNsaWNlKDEsIGh0bWxfdGFnX25vZGVzLmxlbmd0aCAtIDEpO1xuICAgIGZvciAoY29uc3QgbiBvZiBjbGFpbWVkX25vZGVzKSB7XG4gICAgICAgIG4uY2xhaW1fb3JkZXIgPSBub2Rlcy5jbGFpbV9pbmZvLnRvdGFsX2NsYWltZWQ7XG4gICAgICAgIG5vZGVzLmNsYWltX2luZm8udG90YWxfY2xhaW1lZCArPSAxO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEh0bWxUYWdIeWRyYXRpb24oY2xhaW1lZF9ub2RlcywgaXNfc3ZnKTtcbn1cbmZ1bmN0aW9uIHNldF9kYXRhKHRleHQsIGRhdGEpIHtcbiAgICBkYXRhID0gJycgKyBkYXRhO1xuICAgIGlmICh0ZXh0LmRhdGEgPT09IGRhdGEpXG4gICAgICAgIHJldHVybjtcbiAgICB0ZXh0LmRhdGEgPSBkYXRhO1xufVxuZnVuY3Rpb24gc2V0X2RhdGFfY29udGVudGVkaXRhYmxlKHRleHQsIGRhdGEpIHtcbiAgICBkYXRhID0gJycgKyBkYXRhO1xuICAgIGlmICh0ZXh0Lndob2xlVGV4dCA9PT0gZGF0YSlcbiAgICAgICAgcmV0dXJuO1xuICAgIHRleHQuZGF0YSA9IGRhdGE7XG59XG5mdW5jdGlvbiBzZXRfZGF0YV9tYXliZV9jb250ZW50ZWRpdGFibGUodGV4dCwgZGF0YSwgYXR0cl92YWx1ZSkge1xuICAgIGlmICh+Y29udGVudGVkaXRhYmxlX3RydXRoeV92YWx1ZXMuaW5kZXhPZihhdHRyX3ZhbHVlKSkge1xuICAgICAgICBzZXRfZGF0YV9jb250ZW50ZWRpdGFibGUodGV4dCwgZGF0YSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzZXRfZGF0YSh0ZXh0LCBkYXRhKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfaW5wdXRfdmFsdWUoaW5wdXQsIHZhbHVlKSB7XG4gICAgaW5wdXQudmFsdWUgPSB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHNldF9pbnB1dF90eXBlKGlucHV0LCB0eXBlKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaW5wdXQudHlwZSA9IHR5cGU7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfc3R5bGUobm9kZSwga2V5LCB2YWx1ZSwgaW1wb3J0YW50KSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgICAgbm9kZS5zdHlsZS5yZW1vdmVQcm9wZXJ0eShrZXkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbm9kZS5zdHlsZS5zZXRQcm9wZXJ0eShrZXksIHZhbHVlLCBpbXBvcnRhbnQgPyAnaW1wb3J0YW50JyA6ICcnKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzZWxlY3Rfb3B0aW9uKHNlbGVjdCwgdmFsdWUsIG1vdW50aW5nKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3Qub3B0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBzZWxlY3Qub3B0aW9uc1tpXTtcbiAgICAgICAgaWYgKG9wdGlvbi5fX3ZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoIW1vdW50aW5nIHx8IHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2VsZWN0LnNlbGVjdGVkSW5kZXggPSAtMTsgLy8gbm8gb3B0aW9uIHNob3VsZCBiZSBzZWxlY3RlZFxuICAgIH1cbn1cbmZ1bmN0aW9uIHNlbGVjdF9vcHRpb25zKHNlbGVjdCwgdmFsdWUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdC5vcHRpb25zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IHNlbGVjdC5vcHRpb25zW2ldO1xuICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSB+dmFsdWUuaW5kZXhPZihvcHRpb24uX192YWx1ZSk7XG4gICAgfVxufVxuZnVuY3Rpb24gc2VsZWN0X3ZhbHVlKHNlbGVjdCkge1xuICAgIGNvbnN0IHNlbGVjdGVkX29wdGlvbiA9IHNlbGVjdC5xdWVyeVNlbGVjdG9yKCc6Y2hlY2tlZCcpO1xuICAgIHJldHVybiBzZWxlY3RlZF9vcHRpb24gJiYgc2VsZWN0ZWRfb3B0aW9uLl9fdmFsdWU7XG59XG5mdW5jdGlvbiBzZWxlY3RfbXVsdGlwbGVfdmFsdWUoc2VsZWN0KSB7XG4gICAgcmV0dXJuIFtdLm1hcC5jYWxsKHNlbGVjdC5xdWVyeVNlbGVjdG9yQWxsKCc6Y2hlY2tlZCcpLCBvcHRpb24gPT4gb3B0aW9uLl9fdmFsdWUpO1xufVxuLy8gdW5mb3J0dW5hdGVseSB0aGlzIGNhbid0IGJlIGEgY29uc3RhbnQgYXMgdGhhdCB3b3VsZG4ndCBiZSB0cmVlLXNoYWtlYWJsZVxuLy8gc28gd2UgY2FjaGUgdGhlIHJlc3VsdCBpbnN0ZWFkXG5sZXQgY3Jvc3NvcmlnaW47XG5mdW5jdGlvbiBpc19jcm9zc29yaWdpbigpIHtcbiAgICBpZiAoY3Jvc3NvcmlnaW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjcm9zc29yaWdpbiA9IGZhbHNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICB2b2lkIHdpbmRvdy5wYXJlbnQuZG9jdW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjcm9zc29yaWdpbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNyb3Nzb3JpZ2luO1xufVxuZnVuY3Rpb24gYWRkX2lmcmFtZV9yZXNpemVfbGlzdGVuZXIobm9kZSwgZm4pIHtcbiAgICBjb25zdCBjb21wdXRlZF9zdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgaWYgKGNvbXB1dGVkX3N0eWxlLnBvc2l0aW9uID09PSAnc3RhdGljJykge1xuICAgICAgICBub2RlLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICB9XG4gICAgY29uc3QgaWZyYW1lID0gZWxlbWVudCgnaWZyYW1lJyk7XG4gICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTogYmxvY2s7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAwOyBsZWZ0OiAwOyB3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyAnICtcbiAgICAgICAgJ292ZXJmbG93OiBoaWRkZW47IGJvcmRlcjogMDsgb3BhY2l0eTogMDsgcG9pbnRlci1ldmVudHM6IG5vbmU7IHotaW5kZXg6IC0xOycpO1xuICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICBpZnJhbWUudGFiSW5kZXggPSAtMTtcbiAgICBjb25zdCBjcm9zc29yaWdpbiA9IGlzX2Nyb3Nzb3JpZ2luKCk7XG4gICAgbGV0IHVuc3Vic2NyaWJlO1xuICAgIGlmIChjcm9zc29yaWdpbikge1xuICAgICAgICBpZnJhbWUuc3JjID0gXCJkYXRhOnRleHQvaHRtbCw8c2NyaXB0Pm9ucmVzaXplPWZ1bmN0aW9uKCl7cGFyZW50LnBvc3RNZXNzYWdlKDAsJyonKX08L3NjcmlwdD5cIjtcbiAgICAgICAgdW5zdWJzY3JpYmUgPSBsaXN0ZW4od2luZG93LCAnbWVzc2FnZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gaWZyYW1lLmNvbnRlbnRXaW5kb3cpXG4gICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZnJhbWUuc3JjID0gJ2Fib3V0OmJsYW5rJztcbiAgICAgICAgaWZyYW1lLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlID0gbGlzdGVuKGlmcmFtZS5jb250ZW50V2luZG93LCAncmVzaXplJywgZm4pO1xuICAgICAgICAgICAgLy8gbWFrZSBzdXJlIGFuIGluaXRpYWwgcmVzaXplIGV2ZW50IGlzIGZpcmVkIF9hZnRlcl8gdGhlIGlmcmFtZSBpcyBsb2FkZWQgKHdoaWNoIGlzIGFzeW5jaHJvbm91cylcbiAgICAgICAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vc3ZlbHRlanMvc3ZlbHRlL2lzc3Vlcy80MjMzXG4gICAgICAgICAgICBmbigpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBhcHBlbmQobm9kZSwgaWZyYW1lKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAoY3Jvc3NvcmlnaW4pIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodW5zdWJzY3JpYmUgJiYgaWZyYW1lLmNvbnRlbnRXaW5kb3cpIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZGV0YWNoKGlmcmFtZSk7XG4gICAgfTtcbn1cbmNvbnN0IHJlc2l6ZV9vYnNlcnZlcl9jb250ZW50X2JveCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgUmVzaXplT2JzZXJ2ZXJTaW5nbGV0b24oeyBib3g6ICdjb250ZW50LWJveCcgfSk7XG5jb25zdCByZXNpemVfb2JzZXJ2ZXJfYm9yZGVyX2JveCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgUmVzaXplT2JzZXJ2ZXJTaW5nbGV0b24oeyBib3g6ICdib3JkZXItYm94JyB9KTtcbmNvbnN0IHJlc2l6ZV9vYnNlcnZlcl9kZXZpY2VfcGl4ZWxfY29udGVudF9ib3ggPSAvKiBAX19QVVJFX18gKi8gbmV3IFJlc2l6ZU9ic2VydmVyU2luZ2xldG9uKHsgYm94OiAnZGV2aWNlLXBpeGVsLWNvbnRlbnQtYm94JyB9KTtcbmZ1bmN0aW9uIHRvZ2dsZV9jbGFzcyhlbGVtZW50LCBuYW1lLCB0b2dnbGUpIHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdFt0b2dnbGUgPyAnYWRkJyA6ICdyZW1vdmUnXShuYW1lKTtcbn1cbmZ1bmN0aW9uIGN1c3RvbV9ldmVudCh0eXBlLCBkZXRhaWwsIHsgYnViYmxlcyA9IGZhbHNlLCBjYW5jZWxhYmxlID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgY29uc3QgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgIGUuaW5pdEN1c3RvbUV2ZW50KHR5cGUsIGJ1YmJsZXMsIGNhbmNlbGFibGUsIGRldGFpbCk7XG4gICAgcmV0dXJuIGU7XG59XG5mdW5jdGlvbiBxdWVyeV9zZWxlY3Rvcl9hbGwoc2VsZWN0b3IsIHBhcmVudCA9IGRvY3VtZW50LmJvZHkpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShwYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xufVxuZnVuY3Rpb24gaGVhZF9zZWxlY3Rvcihub2RlSWQsIGhlYWQpIHtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICBsZXQgc3RhcnRlZCA9IDA7XG4gICAgZm9yIChjb25zdCBub2RlIG9mIGhlYWQuY2hpbGROb2Rlcykge1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gOCAvKiBjb21tZW50IG5vZGUgKi8pIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbW1lbnQgPSBub2RlLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICAgICAgICAgIGlmIChjb21tZW50ID09PSBgSEVBRF8ke25vZGVJZH1fRU5EYCkge1xuICAgICAgICAgICAgICAgIHN0YXJ0ZWQgLT0gMTtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbW1lbnQgPT09IGBIRUFEXyR7bm9kZUlkfV9TVEFSVGApIHtcbiAgICAgICAgICAgICAgICBzdGFydGVkICs9IDE7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3RhcnRlZCA+IDApIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5jbGFzcyBIdG1sVGFnIHtcbiAgICBjb25zdHJ1Y3Rvcihpc19zdmcgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmlzX3N2ZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzX3N2ZyA9IGlzX3N2ZztcbiAgICAgICAgdGhpcy5lID0gdGhpcy5uID0gbnVsbDtcbiAgICB9XG4gICAgYyhodG1sKSB7XG4gICAgICAgIHRoaXMuaChodG1sKTtcbiAgICB9XG4gICAgbShodG1sLCB0YXJnZXQsIGFuY2hvciA9IG51bGwpIHtcbiAgICAgICAgaWYgKCF0aGlzLmUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzX3N2ZylcbiAgICAgICAgICAgICAgICB0aGlzLmUgPSBzdmdfZWxlbWVudCh0YXJnZXQubm9kZU5hbWUpO1xuICAgICAgICAgICAgLyoqICM3MzY0ICB0YXJnZXQgZm9yIDx0ZW1wbGF0ZT4gbWF5IGJlIHByb3ZpZGVkIGFzICNkb2N1bWVudC1mcmFnbWVudCgxMSkgKi9cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aGlzLmUgPSBlbGVtZW50KCh0YXJnZXQubm9kZVR5cGUgPT09IDExID8gJ1RFTVBMQVRFJyA6IHRhcmdldC5ub2RlTmFtZSkpO1xuICAgICAgICAgICAgdGhpcy50ID0gdGFyZ2V0LnRhZ05hbWUgIT09ICdURU1QTEFURScgPyB0YXJnZXQgOiB0YXJnZXQuY29udGVudDtcbiAgICAgICAgICAgIHRoaXMuYyhodG1sKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmkoYW5jaG9yKTtcbiAgICB9XG4gICAgaChodG1sKSB7XG4gICAgICAgIHRoaXMuZS5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICB0aGlzLm4gPSBBcnJheS5mcm9tKHRoaXMuZS5ub2RlTmFtZSA9PT0gJ1RFTVBMQVRFJyA/IHRoaXMuZS5jb250ZW50LmNoaWxkTm9kZXMgOiB0aGlzLmUuY2hpbGROb2Rlcyk7XG4gICAgfVxuICAgIGkoYW5jaG9yKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpbnNlcnQodGhpcy50LCB0aGlzLm5baV0sIGFuY2hvcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcChodG1sKSB7XG4gICAgICAgIHRoaXMuZCgpO1xuICAgICAgICB0aGlzLmgoaHRtbCk7XG4gICAgICAgIHRoaXMuaSh0aGlzLmEpO1xuICAgIH1cbiAgICBkKCkge1xuICAgICAgICB0aGlzLm4uZm9yRWFjaChkZXRhY2gpO1xuICAgIH1cbn1cbmNsYXNzIEh0bWxUYWdIeWRyYXRpb24gZXh0ZW5kcyBIdG1sVGFnIHtcbiAgICBjb25zdHJ1Y3RvcihjbGFpbWVkX25vZGVzLCBpc19zdmcgPSBmYWxzZSkge1xuICAgICAgICBzdXBlcihpc19zdmcpO1xuICAgICAgICB0aGlzLmUgPSB0aGlzLm4gPSBudWxsO1xuICAgICAgICB0aGlzLmwgPSBjbGFpbWVkX25vZGVzO1xuICAgIH1cbiAgICBjKGh0bWwpIHtcbiAgICAgICAgaWYgKHRoaXMubCkge1xuICAgICAgICAgICAgdGhpcy5uID0gdGhpcy5sO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3VwZXIuYyhodG1sKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpKGFuY2hvcikge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubi5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgaW5zZXJ0X2h5ZHJhdGlvbih0aGlzLnQsIHRoaXMubltpXSwgYW5jaG9yKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGF0dHJpYnV0ZV90b19vYmplY3QoYXR0cmlidXRlcykge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3QgYXR0cmlidXRlIG9mIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgcmVzdWx0W2F0dHJpYnV0ZS5uYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGdldF9jdXN0b21fZWxlbWVudHNfc2xvdHMoZWxlbWVudCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGVsZW1lbnQuY2hpbGROb2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgIHJlc3VsdFtub2RlLnNsb3QgfHwgJ2RlZmF1bHQnXSA9IHRydWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGNvbnN0cnVjdF9zdmVsdGVfY29tcG9uZW50KGNvbXBvbmVudCwgcHJvcHMpIHtcbiAgICByZXR1cm4gbmV3IGNvbXBvbmVudChwcm9wcyk7XG59XG5cbi8vIHdlIG5lZWQgdG8gc3RvcmUgdGhlIGluZm9ybWF0aW9uIGZvciBtdWx0aXBsZSBkb2N1bWVudHMgYmVjYXVzZSBhIFN2ZWx0ZSBhcHBsaWNhdGlvbiBjb3VsZCBhbHNvIGNvbnRhaW4gaWZyYW1lc1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL3N2ZWx0ZWpzL3N2ZWx0ZS9pc3N1ZXMvMzYyNFxuY29uc3QgbWFuYWdlZF9zdHlsZXMgPSBuZXcgTWFwKCk7XG5sZXQgYWN0aXZlID0gMDtcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXJrc2t5YXBwL3N0cmluZy1oYXNoL2Jsb2IvbWFzdGVyL2luZGV4LmpzXG5mdW5jdGlvbiBoYXNoKHN0cikge1xuICAgIGxldCBoYXNoID0gNTM4MTtcbiAgICBsZXQgaSA9IHN0ci5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSlcbiAgICAgICAgaGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpIF4gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGhhc2ggPj4+IDA7XG59XG5mdW5jdGlvbiBjcmVhdGVfc3R5bGVfaW5mb3JtYXRpb24oZG9jLCBub2RlKSB7XG4gICAgY29uc3QgaW5mbyA9IHsgc3R5bGVzaGVldDogYXBwZW5kX2VtcHR5X3N0eWxlc2hlZXQobm9kZSksIHJ1bGVzOiB7fSB9O1xuICAgIG1hbmFnZWRfc3R5bGVzLnNldChkb2MsIGluZm8pO1xuICAgIHJldHVybiBpbmZvO1xufVxuZnVuY3Rpb24gY3JlYXRlX3J1bGUobm9kZSwgYSwgYiwgZHVyYXRpb24sIGRlbGF5LCBlYXNlLCBmbiwgdWlkID0gMCkge1xuICAgIGNvbnN0IHN0ZXAgPSAxNi42NjYgLyBkdXJhdGlvbjtcbiAgICBsZXQga2V5ZnJhbWVzID0gJ3tcXG4nO1xuICAgIGZvciAobGV0IHAgPSAwOyBwIDw9IDE7IHAgKz0gc3RlcCkge1xuICAgICAgICBjb25zdCB0ID0gYSArIChiIC0gYSkgKiBlYXNlKHApO1xuICAgICAgICBrZXlmcmFtZXMgKz0gcCAqIDEwMCArIGAleyR7Zm4odCwgMSAtIHQpfX1cXG5gO1xuICAgIH1cbiAgICBjb25zdCBydWxlID0ga2V5ZnJhbWVzICsgYDEwMCUgeyR7Zm4oYiwgMSAtIGIpfX1cXG59YDtcbiAgICBjb25zdCBuYW1lID0gYF9fc3ZlbHRlXyR7aGFzaChydWxlKX1fJHt1aWR9YDtcbiAgICBjb25zdCBkb2MgPSBnZXRfcm9vdF9mb3Jfc3R5bGUobm9kZSk7XG4gICAgY29uc3QgeyBzdHlsZXNoZWV0LCBydWxlcyB9ID0gbWFuYWdlZF9zdHlsZXMuZ2V0KGRvYykgfHwgY3JlYXRlX3N0eWxlX2luZm9ybWF0aW9uKGRvYywgbm9kZSk7XG4gICAgaWYgKCFydWxlc1tuYW1lXSkge1xuICAgICAgICBydWxlc1tuYW1lXSA9IHRydWU7XG4gICAgICAgIHN0eWxlc2hlZXQuaW5zZXJ0UnVsZShgQGtleWZyYW1lcyAke25hbWV9ICR7cnVsZX1gLCBzdHlsZXNoZWV0LmNzc1J1bGVzLmxlbmd0aCk7XG4gICAgfVxuICAgIGNvbnN0IGFuaW1hdGlvbiA9IG5vZGUuc3R5bGUuYW5pbWF0aW9uIHx8ICcnO1xuICAgIG5vZGUuc3R5bGUuYW5pbWF0aW9uID0gYCR7YW5pbWF0aW9uID8gYCR7YW5pbWF0aW9ufSwgYCA6ICcnfSR7bmFtZX0gJHtkdXJhdGlvbn1tcyBsaW5lYXIgJHtkZWxheX1tcyAxIGJvdGhgO1xuICAgIGFjdGl2ZSArPSAxO1xuICAgIHJldHVybiBuYW1lO1xufVxuZnVuY3Rpb24gZGVsZXRlX3J1bGUobm9kZSwgbmFtZSkge1xuICAgIGNvbnN0IHByZXZpb3VzID0gKG5vZGUuc3R5bGUuYW5pbWF0aW9uIHx8ICcnKS5zcGxpdCgnLCAnKTtcbiAgICBjb25zdCBuZXh0ID0gcHJldmlvdXMuZmlsdGVyKG5hbWVcbiAgICAgICAgPyBhbmltID0+IGFuaW0uaW5kZXhPZihuYW1lKSA8IDAgLy8gcmVtb3ZlIHNwZWNpZmljIGFuaW1hdGlvblxuICAgICAgICA6IGFuaW0gPT4gYW5pbS5pbmRleE9mKCdfX3N2ZWx0ZScpID09PSAtMSAvLyByZW1vdmUgYWxsIFN2ZWx0ZSBhbmltYXRpb25zXG4gICAgKTtcbiAgICBjb25zdCBkZWxldGVkID0gcHJldmlvdXMubGVuZ3RoIC0gbmV4dC5sZW5ndGg7XG4gICAgaWYgKGRlbGV0ZWQpIHtcbiAgICAgICAgbm9kZS5zdHlsZS5hbmltYXRpb24gPSBuZXh0LmpvaW4oJywgJyk7XG4gICAgICAgIGFjdGl2ZSAtPSBkZWxldGVkO1xuICAgICAgICBpZiAoIWFjdGl2ZSlcbiAgICAgICAgICAgIGNsZWFyX3J1bGVzKCk7XG4gICAgfVxufVxuZnVuY3Rpb24gY2xlYXJfcnVsZXMoKSB7XG4gICAgcmFmKCgpID0+IHtcbiAgICAgICAgaWYgKGFjdGl2ZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgbWFuYWdlZF9zdHlsZXMuZm9yRWFjaChpbmZvID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgb3duZXJOb2RlIH0gPSBpbmZvLnN0eWxlc2hlZXQ7XG4gICAgICAgICAgICAvLyB0aGVyZSBpcyBubyBvd25lck5vZGUgaWYgaXQgcnVucyBvbiBqc2RvbS5cbiAgICAgICAgICAgIGlmIChvd25lck5vZGUpXG4gICAgICAgICAgICAgICAgZGV0YWNoKG93bmVyTm9kZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBtYW5hZ2VkX3N0eWxlcy5jbGVhcigpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVfYW5pbWF0aW9uKG5vZGUsIGZyb20sIGZuLCBwYXJhbXMpIHtcbiAgICBpZiAoIWZyb20pXG4gICAgICAgIHJldHVybiBub29wO1xuICAgIGNvbnN0IHRvID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoZnJvbS5sZWZ0ID09PSB0by5sZWZ0ICYmIGZyb20ucmlnaHQgPT09IHRvLnJpZ2h0ICYmIGZyb20udG9wID09PSB0by50b3AgJiYgZnJvbS5ib3R0b20gPT09IHRvLmJvdHRvbSlcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCBlYXNpbmcgPSBpZGVudGl0eSwgXG4gICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBzaG91bGQgdGhpcyBiZSBzZXBhcmF0ZWQgZnJvbSBkZXN0cnVjdHVyaW5nPyBPciBzdGFydC9lbmQgYWRkZWQgdG8gcHVibGljIGFwaSBhbmQgZG9jdW1lbnRhdGlvbj9cbiAgICBzdGFydDogc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXksIFxuICAgIC8vIEB0cy1pZ25vcmUgdG9kbzpcbiAgICBlbmQgPSBzdGFydF90aW1lICsgZHVyYXRpb24sIHRpY2sgPSBub29wLCBjc3MgfSA9IGZuKG5vZGUsIHsgZnJvbSwgdG8gfSwgcGFyYW1zKTtcbiAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgbGV0IHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICBsZXQgbmFtZTtcbiAgICBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgaWYgKGNzcykge1xuICAgICAgICAgICAgbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDAsIDEsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZGVsYXkpIHtcbiAgICAgICAgICAgIHN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBuYW1lKTtcbiAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgIH1cbiAgICBsb29wKG5vdyA9PiB7XG4gICAgICAgIGlmICghc3RhcnRlZCAmJiBub3cgPj0gc3RhcnRfdGltZSkge1xuICAgICAgICAgICAgc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXJ0ZWQgJiYgbm93ID49IGVuZCkge1xuICAgICAgICAgICAgdGljaygxLCAwKTtcbiAgICAgICAgICAgIHN0b3AoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJ1bm5pbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhcnRlZCkge1xuICAgICAgICAgICAgY29uc3QgcCA9IG5vdyAtIHN0YXJ0X3RpbWU7XG4gICAgICAgICAgICBjb25zdCB0ID0gMCArIDEgKiBlYXNpbmcocCAvIGR1cmF0aW9uKTtcbiAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICAgIHN0YXJ0KCk7XG4gICAgdGljaygwLCAxKTtcbiAgICByZXR1cm4gc3RvcDtcbn1cbmZ1bmN0aW9uIGZpeF9wb3NpdGlvbihub2RlKSB7XG4gICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgIGlmIChzdHlsZS5wb3NpdGlvbiAhPT0gJ2Fic29sdXRlJyAmJiBzdHlsZS5wb3NpdGlvbiAhPT0gJ2ZpeGVkJykge1xuICAgICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHN0eWxlO1xuICAgICAgICBjb25zdCBhID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgbm9kZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIG5vZGUuc3R5bGUud2lkdGggPSB3aWR0aDtcbiAgICAgICAgbm9kZS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIGFkZF90cmFuc2Zvcm0obm9kZSwgYSk7XG4gICAgfVxufVxuZnVuY3Rpb24gYWRkX3RyYW5zZm9ybShub2RlLCBhKSB7XG4gICAgY29uc3QgYiA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKGEubGVmdCAhPT0gYi5sZWZ0IHx8IGEudG9wICE9PSBiLnRvcCkge1xuICAgICAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IHN0eWxlLnRyYW5zZm9ybSA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS50cmFuc2Zvcm07XG4gICAgICAgIG5vZGUuc3R5bGUudHJhbnNmb3JtID0gYCR7dHJhbnNmb3JtfSB0cmFuc2xhdGUoJHthLmxlZnQgLSBiLmxlZnR9cHgsICR7YS50b3AgLSBiLnRvcH1weClgO1xuICAgIH1cbn1cblxubGV0IGN1cnJlbnRfY29tcG9uZW50O1xuZnVuY3Rpb24gc2V0X2N1cnJlbnRfY29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgIGN1cnJlbnRfY29tcG9uZW50ID0gY29tcG9uZW50O1xufVxuZnVuY3Rpb24gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkge1xuICAgIGlmICghY3VycmVudF9jb21wb25lbnQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRnVuY3Rpb24gY2FsbGVkIG91dHNpZGUgY29tcG9uZW50IGluaXRpYWxpemF0aW9uJyk7XG4gICAgcmV0dXJuIGN1cnJlbnRfY29tcG9uZW50O1xufVxuLyoqXG4gKiBTY2hlZHVsZXMgYSBjYWxsYmFjayB0byBydW4gaW1tZWRpYXRlbHkgYmVmb3JlIHRoZSBjb21wb25lbnQgaXMgdXBkYXRlZCBhZnRlciBhbnkgc3RhdGUgY2hhbmdlLlxuICpcbiAqIFRoZSBmaXJzdCB0aW1lIHRoZSBjYWxsYmFjayBydW5zIHdpbGwgYmUgYmVmb3JlIHRoZSBpbml0aWFsIGBvbk1vdW50YFxuICpcbiAqIGh0dHBzOi8vc3ZlbHRlLmRldi9kb2NzI3J1bi10aW1lLXN2ZWx0ZS1iZWZvcmV1cGRhdGVcbiAqL1xuZnVuY3Rpb24gYmVmb3JlVXBkYXRlKGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuYmVmb3JlX3VwZGF0ZS5wdXNoKGZuKTtcbn1cbi8qKlxuICogVGhlIGBvbk1vdW50YCBmdW5jdGlvbiBzY2hlZHVsZXMgYSBjYWxsYmFjayB0byBydW4gYXMgc29vbiBhcyB0aGUgY29tcG9uZW50IGhhcyBiZWVuIG1vdW50ZWQgdG8gdGhlIERPTS5cbiAqIEl0IG11c3QgYmUgY2FsbGVkIGR1cmluZyB0aGUgY29tcG9uZW50J3MgaW5pdGlhbGlzYXRpb24gKGJ1dCBkb2Vzbid0IG5lZWQgdG8gbGl2ZSAqaW5zaWRlKiB0aGUgY29tcG9uZW50O1xuICogaXQgY2FuIGJlIGNhbGxlZCBmcm9tIGFuIGV4dGVybmFsIG1vZHVsZSkuXG4gKlxuICogYG9uTW91bnRgIGRvZXMgbm90IHJ1biBpbnNpZGUgYSBbc2VydmVyLXNpZGUgY29tcG9uZW50XSgvZG9jcyNydW4tdGltZS1zZXJ2ZXItc2lkZS1jb21wb25lbnQtYXBpKS5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcyNydW4tdGltZS1zdmVsdGUtb25tb3VudFxuICovXG5mdW5jdGlvbiBvbk1vdW50KGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQub25fbW91bnQucHVzaChmbik7XG59XG4vKipcbiAqIFNjaGVkdWxlcyBhIGNhbGxiYWNrIHRvIHJ1biBpbW1lZGlhdGVseSBhZnRlciB0aGUgY29tcG9uZW50IGhhcyBiZWVuIHVwZGF0ZWQuXG4gKlxuICogVGhlIGZpcnN0IHRpbWUgdGhlIGNhbGxiYWNrIHJ1bnMgd2lsbCBiZSBhZnRlciB0aGUgaW5pdGlhbCBgb25Nb3VudGBcbiAqL1xuZnVuY3Rpb24gYWZ0ZXJVcGRhdGUoZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5hZnRlcl91cGRhdGUucHVzaChmbik7XG59XG4vKipcbiAqIFNjaGVkdWxlcyBhIGNhbGxiYWNrIHRvIHJ1biBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGNvbXBvbmVudCBpcyB1bm1vdW50ZWQuXG4gKlxuICogT3V0IG9mIGBvbk1vdW50YCwgYGJlZm9yZVVwZGF0ZWAsIGBhZnRlclVwZGF0ZWAgYW5kIGBvbkRlc3Ryb3lgLCB0aGlzIGlzIHRoZVxuICogb25seSBvbmUgdGhhdCBydW5zIGluc2lkZSBhIHNlcnZlci1zaWRlIGNvbXBvbmVudC5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcyNydW4tdGltZS1zdmVsdGUtb25kZXN0cm95XG4gKi9cbmZ1bmN0aW9uIG9uRGVzdHJveShmbikge1xuICAgIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLm9uX2Rlc3Ryb3kucHVzaChmbik7XG59XG4vKipcbiAqIENyZWF0ZXMgYW4gZXZlbnQgZGlzcGF0Y2hlciB0aGF0IGNhbiBiZSB1c2VkIHRvIGRpc3BhdGNoIFtjb21wb25lbnQgZXZlbnRzXSgvZG9jcyN0ZW1wbGF0ZS1zeW50YXgtY29tcG9uZW50LWRpcmVjdGl2ZXMtb24tZXZlbnRuYW1lKS5cbiAqIEV2ZW50IGRpc3BhdGNoZXJzIGFyZSBmdW5jdGlvbnMgdGhhdCBjYW4gdGFrZSB0d28gYXJndW1lbnRzOiBgbmFtZWAgYW5kIGBkZXRhaWxgLlxuICpcbiAqIENvbXBvbmVudCBldmVudHMgY3JlYXRlZCB3aXRoIGBjcmVhdGVFdmVudERpc3BhdGNoZXJgIGNyZWF0ZSBhXG4gKiBbQ3VzdG9tRXZlbnRdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DdXN0b21FdmVudCkuXG4gKiBUaGVzZSBldmVudHMgZG8gbm90IFtidWJibGVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvTGVhcm4vSmF2YVNjcmlwdC9CdWlsZGluZ19ibG9ja3MvRXZlbnRzI0V2ZW50X2J1YmJsaW5nX2FuZF9jYXB0dXJlKS5cbiAqIFRoZSBgZGV0YWlsYCBhcmd1bWVudCBjb3JyZXNwb25kcyB0byB0aGUgW0N1c3RvbUV2ZW50LmRldGFpbF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0N1c3RvbUV2ZW50L2RldGFpbClcbiAqIHByb3BlcnR5IGFuZCBjYW4gY29udGFpbiBhbnkgdHlwZSBvZiBkYXRhLlxuICpcbiAqIGh0dHBzOi8vc3ZlbHRlLmRldi9kb2NzI3J1bi10aW1lLXN2ZWx0ZS1jcmVhdGVldmVudGRpc3BhdGNoZXJcbiAqL1xuZnVuY3Rpb24gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCkge1xuICAgIGNvbnN0IGNvbXBvbmVudCA9IGdldF9jdXJyZW50X2NvbXBvbmVudCgpO1xuICAgIHJldHVybiAodHlwZSwgZGV0YWlsLCB7IGNhbmNlbGFibGUgPSBmYWxzZSB9ID0ge30pID0+IHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2tzID0gY29tcG9uZW50LiQkLmNhbGxiYWNrc1t0eXBlXTtcbiAgICAgICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgICAgICAgLy8gVE9ETyBhcmUgdGhlcmUgc2l0dWF0aW9ucyB3aGVyZSBldmVudHMgY291bGQgYmUgZGlzcGF0Y2hlZFxuICAgICAgICAgICAgLy8gaW4gYSBzZXJ2ZXIgKG5vbi1ET00pIGVudmlyb25tZW50P1xuICAgICAgICAgICAgY29uc3QgZXZlbnQgPSBjdXN0b21fZXZlbnQodHlwZSwgZGV0YWlsLCB7IGNhbmNlbGFibGUgfSk7XG4gICAgICAgICAgICBjYWxsYmFja3Muc2xpY2UoKS5mb3JFYWNoKGZuID0+IHtcbiAgICAgICAgICAgICAgICBmbi5jYWxsKGNvbXBvbmVudCwgZXZlbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gIWV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbn1cbi8qKlxuICogQXNzb2NpYXRlcyBhbiBhcmJpdHJhcnkgYGNvbnRleHRgIG9iamVjdCB3aXRoIHRoZSBjdXJyZW50IGNvbXBvbmVudCBhbmQgdGhlIHNwZWNpZmllZCBga2V5YFxuICogYW5kIHJldHVybnMgdGhhdCBvYmplY3QuIFRoZSBjb250ZXh0IGlzIHRoZW4gYXZhaWxhYmxlIHRvIGNoaWxkcmVuIG9mIHRoZSBjb21wb25lbnRcbiAqIChpbmNsdWRpbmcgc2xvdHRlZCBjb250ZW50KSB3aXRoIGBnZXRDb250ZXh0YC5cbiAqXG4gKiBMaWtlIGxpZmVjeWNsZSBmdW5jdGlvbnMsIHRoaXMgbXVzdCBiZSBjYWxsZWQgZHVyaW5nIGNvbXBvbmVudCBpbml0aWFsaXNhdGlvbi5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcyNydW4tdGltZS1zdmVsdGUtc2V0Y29udGV4dFxuICovXG5mdW5jdGlvbiBzZXRDb250ZXh0KGtleSwgY29udGV4dCkge1xuICAgIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmNvbnRleHQuc2V0KGtleSwgY29udGV4dCk7XG4gICAgcmV0dXJuIGNvbnRleHQ7XG59XG4vKipcbiAqIFJldHJpZXZlcyB0aGUgY29udGV4dCB0aGF0IGJlbG9uZ3MgdG8gdGhlIGNsb3Nlc3QgcGFyZW50IGNvbXBvbmVudCB3aXRoIHRoZSBzcGVjaWZpZWQgYGtleWAuXG4gKiBNdXN0IGJlIGNhbGxlZCBkdXJpbmcgY29tcG9uZW50IGluaXRpYWxpc2F0aW9uLlxuICpcbiAqIGh0dHBzOi8vc3ZlbHRlLmRldi9kb2NzI3J1bi10aW1lLXN2ZWx0ZS1nZXRjb250ZXh0XG4gKi9cbmZ1bmN0aW9uIGdldENvbnRleHQoa2V5KSB7XG4gICAgcmV0dXJuIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmNvbnRleHQuZ2V0KGtleSk7XG59XG4vKipcbiAqIFJldHJpZXZlcyB0aGUgd2hvbGUgY29udGV4dCBtYXAgdGhhdCBiZWxvbmdzIHRvIHRoZSBjbG9zZXN0IHBhcmVudCBjb21wb25lbnQuXG4gKiBNdXN0IGJlIGNhbGxlZCBkdXJpbmcgY29tcG9uZW50IGluaXRpYWxpc2F0aW9uLiBVc2VmdWwsIGZvciBleGFtcGxlLCBpZiB5b3VcbiAqIHByb2dyYW1tYXRpY2FsbHkgY3JlYXRlIGEgY29tcG9uZW50IGFuZCB3YW50IHRvIHBhc3MgdGhlIGV4aXN0aW5nIGNvbnRleHQgdG8gaXQuXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3MjcnVuLXRpbWUtc3ZlbHRlLWdldGFsbGNvbnRleHRzXG4gKi9cbmZ1bmN0aW9uIGdldEFsbENvbnRleHRzKCkge1xuICAgIHJldHVybiBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5jb250ZXh0O1xufVxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBhIGdpdmVuIGBrZXlgIGhhcyBiZWVuIHNldCBpbiB0aGUgY29udGV4dCBvZiBhIHBhcmVudCBjb21wb25lbnQuXG4gKiBNdXN0IGJlIGNhbGxlZCBkdXJpbmcgY29tcG9uZW50IGluaXRpYWxpc2F0aW9uLlxuICpcbiAqIGh0dHBzOi8vc3ZlbHRlLmRldi9kb2NzI3J1bi10aW1lLXN2ZWx0ZS1oYXNjb250ZXh0XG4gKi9cbmZ1bmN0aW9uIGhhc0NvbnRleHQoa2V5KSB7XG4gICAgcmV0dXJuIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmNvbnRleHQuaGFzKGtleSk7XG59XG4vLyBUT0RPIGZpZ3VyZSBvdXQgaWYgd2Ugc3RpbGwgd2FudCB0byBzdXBwb3J0XG4vLyBzaG9ydGhhbmQgZXZlbnRzLCBvciBpZiB3ZSB3YW50IHRvIGltcGxlbWVudFxuLy8gYSByZWFsIGJ1YmJsaW5nIG1lY2hhbmlzbVxuZnVuY3Rpb24gYnViYmxlKGNvbXBvbmVudCwgZXZlbnQpIHtcbiAgICBjb25zdCBjYWxsYmFja3MgPSBjb21wb25lbnQuJCQuY2FsbGJhY2tzW2V2ZW50LnR5cGVdO1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjYWxsYmFja3Muc2xpY2UoKS5mb3JFYWNoKGZuID0+IGZuLmNhbGwodGhpcywgZXZlbnQpKTtcbiAgICB9XG59XG5cbmNvbnN0IGRpcnR5X2NvbXBvbmVudHMgPSBbXTtcbmNvbnN0IGludHJvcyA9IHsgZW5hYmxlZDogZmFsc2UgfTtcbmNvbnN0IGJpbmRpbmdfY2FsbGJhY2tzID0gW107XG5sZXQgcmVuZGVyX2NhbGxiYWNrcyA9IFtdO1xuY29uc3QgZmx1c2hfY2FsbGJhY2tzID0gW107XG5jb25zdCByZXNvbHZlZF9wcm9taXNlID0gLyogQF9fUFVSRV9fICovIFByb21pc2UucmVzb2x2ZSgpO1xubGV0IHVwZGF0ZV9zY2hlZHVsZWQgPSBmYWxzZTtcbmZ1bmN0aW9uIHNjaGVkdWxlX3VwZGF0ZSgpIHtcbiAgICBpZiAoIXVwZGF0ZV9zY2hlZHVsZWQpIHtcbiAgICAgICAgdXBkYXRlX3NjaGVkdWxlZCA9IHRydWU7XG4gICAgICAgIHJlc29sdmVkX3Byb21pc2UudGhlbihmbHVzaCk7XG4gICAgfVxufVxuZnVuY3Rpb24gdGljaygpIHtcbiAgICBzY2hlZHVsZV91cGRhdGUoKTtcbiAgICByZXR1cm4gcmVzb2x2ZWRfcHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGFkZF9yZW5kZXJfY2FsbGJhY2soZm4pIHtcbiAgICByZW5kZXJfY2FsbGJhY2tzLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gYWRkX2ZsdXNoX2NhbGxiYWNrKGZuKSB7XG4gICAgZmx1c2hfY2FsbGJhY2tzLnB1c2goZm4pO1xufVxuLy8gZmx1c2goKSBjYWxscyBjYWxsYmFja3MgaW4gdGhpcyBvcmRlcjpcbi8vIDEuIEFsbCBiZWZvcmVVcGRhdGUgY2FsbGJhY2tzLCBpbiBvcmRlcjogcGFyZW50cyBiZWZvcmUgY2hpbGRyZW5cbi8vIDIuIEFsbCBiaW5kOnRoaXMgY2FsbGJhY2tzLCBpbiByZXZlcnNlIG9yZGVyOiBjaGlsZHJlbiBiZWZvcmUgcGFyZW50cy5cbi8vIDMuIEFsbCBhZnRlclVwZGF0ZSBjYWxsYmFja3MsIGluIG9yZGVyOiBwYXJlbnRzIGJlZm9yZSBjaGlsZHJlbi4gRVhDRVBUXG4vLyAgICBmb3IgYWZ0ZXJVcGRhdGVzIGNhbGxlZCBkdXJpbmcgdGhlIGluaXRpYWwgb25Nb3VudCwgd2hpY2ggYXJlIGNhbGxlZCBpblxuLy8gICAgcmV2ZXJzZSBvcmRlcjogY2hpbGRyZW4gYmVmb3JlIHBhcmVudHMuXG4vLyBTaW5jZSBjYWxsYmFja3MgbWlnaHQgdXBkYXRlIGNvbXBvbmVudCB2YWx1ZXMsIHdoaWNoIGNvdWxkIHRyaWdnZXIgYW5vdGhlclxuLy8gY2FsbCB0byBmbHVzaCgpLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGd1YXJkIGFnYWluc3QgdGhpczpcbi8vIDEuIER1cmluZyBiZWZvcmVVcGRhdGUsIGFueSB1cGRhdGVkIGNvbXBvbmVudHMgd2lsbCBiZSBhZGRlZCB0byB0aGVcbi8vICAgIGRpcnR5X2NvbXBvbmVudHMgYXJyYXkgYW5kIHdpbGwgY2F1c2UgYSByZWVudHJhbnQgY2FsbCB0byBmbHVzaCgpLiBCZWNhdXNlXG4vLyAgICB0aGUgZmx1c2ggaW5kZXggaXMga2VwdCBvdXRzaWRlIHRoZSBmdW5jdGlvbiwgdGhlIHJlZW50cmFudCBjYWxsIHdpbGwgcGlja1xuLy8gICAgdXAgd2hlcmUgdGhlIGVhcmxpZXIgY2FsbCBsZWZ0IG9mZiBhbmQgZ28gdGhyb3VnaCBhbGwgZGlydHkgY29tcG9uZW50cy4gVGhlXG4vLyAgICBjdXJyZW50X2NvbXBvbmVudCB2YWx1ZSBpcyBzYXZlZCBhbmQgcmVzdG9yZWQgc28gdGhhdCB0aGUgcmVlbnRyYW50IGNhbGwgd2lsbFxuLy8gICAgbm90IGludGVyZmVyZSB3aXRoIHRoZSBcInBhcmVudFwiIGZsdXNoKCkgY2FsbC5cbi8vIDIuIGJpbmQ6dGhpcyBjYWxsYmFja3MgY2Fubm90IHRyaWdnZXIgbmV3IGZsdXNoKCkgY2FsbHMuXG4vLyAzLiBEdXJpbmcgYWZ0ZXJVcGRhdGUsIGFueSB1cGRhdGVkIGNvbXBvbmVudHMgd2lsbCBOT1QgaGF2ZSB0aGVpciBhZnRlclVwZGF0ZVxuLy8gICAgY2FsbGJhY2sgY2FsbGVkIGEgc2Vjb25kIHRpbWU7IHRoZSBzZWVuX2NhbGxiYWNrcyBzZXQsIG91dHNpZGUgdGhlIGZsdXNoKClcbi8vICAgIGZ1bmN0aW9uLCBndWFyYW50ZWVzIHRoaXMgYmVoYXZpb3IuXG5jb25zdCBzZWVuX2NhbGxiYWNrcyA9IG5ldyBTZXQoKTtcbmxldCBmbHVzaGlkeCA9IDA7IC8vIERvICpub3QqIG1vdmUgdGhpcyBpbnNpZGUgdGhlIGZsdXNoKCkgZnVuY3Rpb25cbmZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIC8vIERvIG5vdCByZWVudGVyIGZsdXNoIHdoaWxlIGRpcnR5IGNvbXBvbmVudHMgYXJlIHVwZGF0ZWQsIGFzIHRoaXMgY2FuXG4gICAgLy8gcmVzdWx0IGluIGFuIGluZmluaXRlIGxvb3AuIEluc3RlYWQsIGxldCB0aGUgaW5uZXIgZmx1c2ggaGFuZGxlIGl0LlxuICAgIC8vIFJlZW50cmFuY3kgaXMgb2sgYWZ0ZXJ3YXJkcyBmb3IgYmluZGluZ3MgZXRjLlxuICAgIGlmIChmbHVzaGlkeCAhPT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHNhdmVkX2NvbXBvbmVudCA9IGN1cnJlbnRfY29tcG9uZW50O1xuICAgIGRvIHtcbiAgICAgICAgLy8gZmlyc3QsIGNhbGwgYmVmb3JlVXBkYXRlIGZ1bmN0aW9uc1xuICAgICAgICAvLyBhbmQgdXBkYXRlIGNvbXBvbmVudHNcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHdoaWxlIChmbHVzaGlkeCA8IGRpcnR5X2NvbXBvbmVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZGlydHlfY29tcG9uZW50c1tmbHVzaGlkeF07XG4gICAgICAgICAgICAgICAgZmx1c2hpZHgrKztcbiAgICAgICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICB1cGRhdGUoY29tcG9uZW50LiQkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLy8gcmVzZXQgZGlydHkgc3RhdGUgdG8gbm90IGVuZCB1cCBpbiBhIGRlYWRsb2NrZWQgc3RhdGUgYW5kIHRoZW4gcmV0aHJvd1xuICAgICAgICAgICAgZGlydHlfY29tcG9uZW50cy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgZmx1c2hpZHggPSAwO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQobnVsbCk7XG4gICAgICAgIGRpcnR5X2NvbXBvbmVudHMubGVuZ3RoID0gMDtcbiAgICAgICAgZmx1c2hpZHggPSAwO1xuICAgICAgICB3aGlsZSAoYmluZGluZ19jYWxsYmFja3MubGVuZ3RoKVxuICAgICAgICAgICAgYmluZGluZ19jYWxsYmFja3MucG9wKCkoKTtcbiAgICAgICAgLy8gdGhlbiwgb25jZSBjb21wb25lbnRzIGFyZSB1cGRhdGVkLCBjYWxsXG4gICAgICAgIC8vIGFmdGVyVXBkYXRlIGZ1bmN0aW9ucy4gVGhpcyBtYXkgY2F1c2VcbiAgICAgICAgLy8gc3Vic2VxdWVudCB1cGRhdGVzLi4uXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVuZGVyX2NhbGxiYWNrcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSByZW5kZXJfY2FsbGJhY2tzW2ldO1xuICAgICAgICAgICAgaWYgKCFzZWVuX2NhbGxiYWNrcy5oYXMoY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgLy8gLi4uc28gZ3VhcmQgYWdhaW5zdCBpbmZpbml0ZSBsb29wc1xuICAgICAgICAgICAgICAgIHNlZW5fY2FsbGJhY2tzLmFkZChjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZW5kZXJfY2FsbGJhY2tzLmxlbmd0aCA9IDA7XG4gICAgfSB3aGlsZSAoZGlydHlfY29tcG9uZW50cy5sZW5ndGgpO1xuICAgIHdoaWxlIChmbHVzaF9jYWxsYmFja3MubGVuZ3RoKSB7XG4gICAgICAgIGZsdXNoX2NhbGxiYWNrcy5wb3AoKSgpO1xuICAgIH1cbiAgICB1cGRhdGVfc2NoZWR1bGVkID0gZmFsc2U7XG4gICAgc2Vlbl9jYWxsYmFja3MuY2xlYXIoKTtcbiAgICBzZXRfY3VycmVudF9jb21wb25lbnQoc2F2ZWRfY29tcG9uZW50KTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZSgkJCkge1xuICAgIGlmICgkJC5mcmFnbWVudCAhPT0gbnVsbCkge1xuICAgICAgICAkJC51cGRhdGUoKTtcbiAgICAgICAgcnVuX2FsbCgkJC5iZWZvcmVfdXBkYXRlKTtcbiAgICAgICAgY29uc3QgZGlydHkgPSAkJC5kaXJ0eTtcbiAgICAgICAgJCQuZGlydHkgPSBbLTFdO1xuICAgICAgICAkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5wKCQkLmN0eCwgZGlydHkpO1xuICAgICAgICAkJC5hZnRlcl91cGRhdGUuZm9yRWFjaChhZGRfcmVuZGVyX2NhbGxiYWNrKTtcbiAgICB9XG59XG4vKipcbiAqIFVzZWZ1bCBmb3IgZXhhbXBsZSB0byBleGVjdXRlIHJlbWFpbmluZyBgYWZ0ZXJVcGRhdGVgIGNhbGxiYWNrcyBiZWZvcmUgZXhlY3V0aW5nIGBkZXN0cm95YC5cbiAqL1xuZnVuY3Rpb24gZmx1c2hfcmVuZGVyX2NhbGxiYWNrcyhmbnMpIHtcbiAgICBjb25zdCBmaWx0ZXJlZCA9IFtdO1xuICAgIGNvbnN0IHRhcmdldHMgPSBbXTtcbiAgICByZW5kZXJfY2FsbGJhY2tzLmZvckVhY2goKGMpID0+IGZucy5pbmRleE9mKGMpID09PSAtMSA/IGZpbHRlcmVkLnB1c2goYykgOiB0YXJnZXRzLnB1c2goYykpO1xuICAgIHRhcmdldHMuZm9yRWFjaCgoYykgPT4gYygpKTtcbiAgICByZW5kZXJfY2FsbGJhY2tzID0gZmlsdGVyZWQ7XG59XG5cbmxldCBwcm9taXNlO1xuZnVuY3Rpb24gd2FpdCgpIHtcbiAgICBpZiAoIXByb21pc2UpIHtcbiAgICAgICAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcHJvbWlzZSA9IG51bGw7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGRpc3BhdGNoKG5vZGUsIGRpcmVjdGlvbiwga2luZCkge1xuICAgIG5vZGUuZGlzcGF0Y2hFdmVudChjdXN0b21fZXZlbnQoYCR7ZGlyZWN0aW9uID8gJ2ludHJvJyA6ICdvdXRybyd9JHtraW5kfWApKTtcbn1cbmNvbnN0IG91dHJvaW5nID0gbmV3IFNldCgpO1xubGV0IG91dHJvcztcbmZ1bmN0aW9uIGdyb3VwX291dHJvcygpIHtcbiAgICBvdXRyb3MgPSB7XG4gICAgICAgIHI6IDAsXG4gICAgICAgIGM6IFtdLFxuICAgICAgICBwOiBvdXRyb3MgLy8gcGFyZW50IGdyb3VwXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNoZWNrX291dHJvcygpIHtcbiAgICBpZiAoIW91dHJvcy5yKSB7XG4gICAgICAgIHJ1bl9hbGwob3V0cm9zLmMpO1xuICAgIH1cbiAgICBvdXRyb3MgPSBvdXRyb3MucDtcbn1cbmZ1bmN0aW9uIHRyYW5zaXRpb25faW4oYmxvY2ssIGxvY2FsKSB7XG4gICAgaWYgKGJsb2NrICYmIGJsb2NrLmkpIHtcbiAgICAgICAgb3V0cm9pbmcuZGVsZXRlKGJsb2NrKTtcbiAgICAgICAgYmxvY2suaShsb2NhbCk7XG4gICAgfVxufVxuZnVuY3Rpb24gdHJhbnNpdGlvbl9vdXQoYmxvY2ssIGxvY2FsLCBkZXRhY2gsIGNhbGxiYWNrKSB7XG4gICAgaWYgKGJsb2NrICYmIGJsb2NrLm8pIHtcbiAgICAgICAgaWYgKG91dHJvaW5nLmhhcyhibG9jaykpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIG91dHJvaW5nLmFkZChibG9jayk7XG4gICAgICAgIG91dHJvcy5jLnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgb3V0cm9pbmcuZGVsZXRlKGJsb2NrKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmIChkZXRhY2gpXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLmQoMSk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGJsb2NrLm8obG9jYWwpO1xuICAgIH1cbiAgICBlbHNlIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgIH1cbn1cbmNvbnN0IG51bGxfdHJhbnNpdGlvbiA9IHsgZHVyYXRpb246IDAgfTtcbmZ1bmN0aW9uIGNyZWF0ZV9pbl90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMpIHtcbiAgICBjb25zdCBvcHRpb25zID0geyBkaXJlY3Rpb246ICdpbicgfTtcbiAgICBsZXQgY29uZmlnID0gZm4obm9kZSwgcGFyYW1zLCBvcHRpb25zKTtcbiAgICBsZXQgcnVubmluZyA9IGZhbHNlO1xuICAgIGxldCBhbmltYXRpb25fbmFtZTtcbiAgICBsZXQgdGFzaztcbiAgICBsZXQgdWlkID0gMDtcbiAgICBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgICAgICBpZiAoYW5pbWF0aW9uX25hbWUpXG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBhbmltYXRpb25fbmFtZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdvKCkge1xuICAgICAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSAzMDAsIGVhc2luZyA9IGlkZW50aXR5LCB0aWNrID0gbm9vcCwgY3NzIH0gPSBjb25maWcgfHwgbnVsbF90cmFuc2l0aW9uO1xuICAgICAgICBpZiAoY3NzKVxuICAgICAgICAgICAgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCAwLCAxLCBkdXJhdGlvbiwgZGVsYXksIGVhc2luZywgY3NzLCB1aWQrKyk7XG4gICAgICAgIHRpY2soMCwgMSk7XG4gICAgICAgIGNvbnN0IHN0YXJ0X3RpbWUgPSBub3coKSArIGRlbGF5O1xuICAgICAgICBjb25zdCBlbmRfdGltZSA9IHN0YXJ0X3RpbWUgKyBkdXJhdGlvbjtcbiAgICAgICAgaWYgKHRhc2spXG4gICAgICAgICAgICB0YXNrLmFib3J0KCk7XG4gICAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICBhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IGRpc3BhdGNoKG5vZGUsIHRydWUsICdzdGFydCcpKTtcbiAgICAgICAgdGFzayA9IGxvb3Aobm93ID0+IHtcbiAgICAgICAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBlbmRfdGltZSkge1xuICAgICAgICAgICAgICAgICAgICB0aWNrKDEsIDApO1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChub2RlLCB0cnVlLCAnZW5kJyk7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBzdGFydF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBlYXNpbmcoKG5vdyAtIHN0YXJ0X3RpbWUpIC8gZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB0aWNrKHQsIDEgLSB0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcnVubmluZztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGxldCBzdGFydGVkID0gZmFsc2U7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQoKSB7XG4gICAgICAgICAgICBpZiAoc3RhcnRlZClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBzdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICBjb25maWcgPSBjb25maWcob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgd2FpdCgpLnRoZW4oZ28pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZ28oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaW52YWxpZGF0ZSgpIHtcbiAgICAgICAgICAgIHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW5kKCkge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgICAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZV9vdXRfdHJhbnNpdGlvbihub2RlLCBmbiwgcGFyYW1zKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgZGlyZWN0aW9uOiAnb3V0JyB9O1xuICAgIGxldCBjb25maWcgPSBmbihub2RlLCBwYXJhbXMsIG9wdGlvbnMpO1xuICAgIGxldCBydW5uaW5nID0gdHJ1ZTtcbiAgICBsZXQgYW5pbWF0aW9uX25hbWU7XG4gICAgY29uc3QgZ3JvdXAgPSBvdXRyb3M7XG4gICAgZ3JvdXAuciArPSAxO1xuICAgIGZ1bmN0aW9uIGdvKCkge1xuICAgICAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSAzMDAsIGVhc2luZyA9IGlkZW50aXR5LCB0aWNrID0gbm9vcCwgY3NzIH0gPSBjb25maWcgfHwgbnVsbF90cmFuc2l0aW9uO1xuICAgICAgICBpZiAoY3NzKVxuICAgICAgICAgICAgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCAxLCAwLCBkdXJhdGlvbiwgZGVsYXksIGVhc2luZywgY3NzKTtcbiAgICAgICAgY29uc3Qgc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXk7XG4gICAgICAgIGNvbnN0IGVuZF90aW1lID0gc3RhcnRfdGltZSArIGR1cmF0aW9uO1xuICAgICAgICBhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IGRpc3BhdGNoKG5vZGUsIGZhbHNlLCAnc3RhcnQnKSk7XG4gICAgICAgIGxvb3Aobm93ID0+IHtcbiAgICAgICAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBlbmRfdGltZSkge1xuICAgICAgICAgICAgICAgICAgICB0aWNrKDAsIDEpO1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChub2RlLCBmYWxzZSwgJ2VuZCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIS0tZ3JvdXAucikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyB3aWxsIHJlc3VsdCBpbiBgZW5kKClgIGJlaW5nIGNhbGxlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNvIHdlIGRvbid0IG5lZWQgdG8gY2xlYW4gdXAgaGVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgcnVuX2FsbChncm91cC5jKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChub3cgPj0gc3RhcnRfdGltZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ID0gZWFzaW5nKChub3cgLSBzdGFydF90aW1lKSAvIGR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgdGljaygxIC0gdCwgdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJ1bm5pbmc7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoaXNfZnVuY3Rpb24oY29uZmlnKSkge1xuICAgICAgICB3YWl0KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBjb25maWcgPSBjb25maWcob3B0aW9ucyk7XG4gICAgICAgICAgICBnbygpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGdvKCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGVuZChyZXNldCkge1xuICAgICAgICAgICAgaWYgKHJlc2V0ICYmIGNvbmZpZy50aWNrKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLnRpY2soMSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGlmIChhbmltYXRpb25fbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlX3J1bGUobm9kZSwgYW5pbWF0aW9uX25hbWUpO1xuICAgICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiBjcmVhdGVfYmlkaXJlY3Rpb25hbF90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMsIGludHJvKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgZGlyZWN0aW9uOiAnYm90aCcgfTtcbiAgICBsZXQgY29uZmlnID0gZm4obm9kZSwgcGFyYW1zLCBvcHRpb25zKTtcbiAgICBsZXQgdCA9IGludHJvID8gMCA6IDE7XG4gICAgbGV0IHJ1bm5pbmdfcHJvZ3JhbSA9IG51bGw7XG4gICAgbGV0IHBlbmRpbmdfcHJvZ3JhbSA9IG51bGw7XG4gICAgbGV0IGFuaW1hdGlvbl9uYW1lID0gbnVsbDtcbiAgICBmdW5jdGlvbiBjbGVhcl9hbmltYXRpb24oKSB7XG4gICAgICAgIGlmIChhbmltYXRpb25fbmFtZSlcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIGFuaW1hdGlvbl9uYW1lKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaW5pdChwcm9ncmFtLCBkdXJhdGlvbikge1xuICAgICAgICBjb25zdCBkID0gKHByb2dyYW0uYiAtIHQpO1xuICAgICAgICBkdXJhdGlvbiAqPSBNYXRoLmFicyhkKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGE6IHQsXG4gICAgICAgICAgICBiOiBwcm9ncmFtLmIsXG4gICAgICAgICAgICBkLFxuICAgICAgICAgICAgZHVyYXRpb24sXG4gICAgICAgICAgICBzdGFydDogcHJvZ3JhbS5zdGFydCxcbiAgICAgICAgICAgIGVuZDogcHJvZ3JhbS5zdGFydCArIGR1cmF0aW9uLFxuICAgICAgICAgICAgZ3JvdXA6IHByb2dyYW0uZ3JvdXBcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ28oYikge1xuICAgICAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSAzMDAsIGVhc2luZyA9IGlkZW50aXR5LCB0aWNrID0gbm9vcCwgY3NzIH0gPSBjb25maWcgfHwgbnVsbF90cmFuc2l0aW9uO1xuICAgICAgICBjb25zdCBwcm9ncmFtID0ge1xuICAgICAgICAgICAgc3RhcnQ6IG5vdygpICsgZGVsYXksXG4gICAgICAgICAgICBiXG4gICAgICAgIH07XG4gICAgICAgIGlmICghYikge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBpbXByb3ZlIHR5cGluZ3NcbiAgICAgICAgICAgIHByb2dyYW0uZ3JvdXAgPSBvdXRyb3M7XG4gICAgICAgICAgICBvdXRyb3MuciArPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChydW5uaW5nX3Byb2dyYW0gfHwgcGVuZGluZ19wcm9ncmFtKSB7XG4gICAgICAgICAgICBwZW5kaW5nX3Byb2dyYW0gPSBwcm9ncmFtO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gaWYgdGhpcyBpcyBhbiBpbnRybywgYW5kIHRoZXJlJ3MgYSBkZWxheSwgd2UgbmVlZCB0byBkb1xuICAgICAgICAgICAgLy8gYW4gaW5pdGlhbCB0aWNrIGFuZC9vciBhcHBseSBDU1MgYW5pbWF0aW9uIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICBpZiAoY3NzKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJfYW5pbWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCB0LCBiLCBkdXJhdGlvbiwgZGVsYXksIGVhc2luZywgY3NzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiKVxuICAgICAgICAgICAgICAgIHRpY2soMCwgMSk7XG4gICAgICAgICAgICBydW5uaW5nX3Byb2dyYW0gPSBpbml0KHByb2dyYW0sIGR1cmF0aW9uKTtcbiAgICAgICAgICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4gZGlzcGF0Y2gobm9kZSwgYiwgJ3N0YXJ0JykpO1xuICAgICAgICAgICAgbG9vcChub3cgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChwZW5kaW5nX3Byb2dyYW0gJiYgbm93ID4gcGVuZGluZ19wcm9ncmFtLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bm5pbmdfcHJvZ3JhbSA9IGluaXQocGVuZGluZ19wcm9ncmFtLCBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHBlbmRpbmdfcHJvZ3JhbSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIHJ1bm5pbmdfcHJvZ3JhbS5iLCAnc3RhcnQnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJfYW5pbWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIHQsIHJ1bm5pbmdfcHJvZ3JhbS5iLCBydW5uaW5nX3Byb2dyYW0uZHVyYXRpb24sIDAsIGVhc2luZywgY29uZmlnLmNzcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJ1bm5pbmdfcHJvZ3JhbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobm93ID49IHJ1bm5pbmdfcHJvZ3JhbS5lbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpY2sodCA9IHJ1bm5pbmdfcHJvZ3JhbS5iLCAxIC0gdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChub2RlLCBydW5uaW5nX3Byb2dyYW0uYiwgJ2VuZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwZW5kaW5nX3Byb2dyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3ZSdyZSBkb25lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bm5pbmdfcHJvZ3JhbS5iKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGludHJvIOKAlCB3ZSBjYW4gdGlkeSB1cCBpbW1lZGlhdGVseVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhcl9hbmltYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG91dHJvIOKAlCBuZWVkcyB0byBiZSBjb29yZGluYXRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIS0tcnVubmluZ19wcm9ncmFtLmdyb3VwLnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBydW5fYWxsKHJ1bm5pbmdfcHJvZ3JhbS5ncm91cC5jKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBydW5uaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5vdyA+PSBydW5uaW5nX3Byb2dyYW0uc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBub3cgLSBydW5uaW5nX3Byb2dyYW0uc3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ID0gcnVubmluZ19wcm9ncmFtLmEgKyBydW5uaW5nX3Byb2dyYW0uZCAqIGVhc2luZyhwIC8gcnVubmluZ19wcm9ncmFtLmR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAhIShydW5uaW5nX3Byb2dyYW0gfHwgcGVuZGluZ19wcm9ncmFtKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHJ1bihiKSB7XG4gICAgICAgICAgICBpZiAoaXNfZnVuY3Rpb24oY29uZmlnKSkge1xuICAgICAgICAgICAgICAgIHdhaXQoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBjb25maWcgPSBjb25maWcob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIGdvKGIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZ28oYik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVuZCgpIHtcbiAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gcGVuZGluZ19wcm9ncmFtID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGhhbmRsZV9wcm9taXNlKHByb21pc2UsIGluZm8pIHtcbiAgICBjb25zdCB0b2tlbiA9IGluZm8udG9rZW4gPSB7fTtcbiAgICBmdW5jdGlvbiB1cGRhdGUodHlwZSwgaW5kZXgsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGluZm8udG9rZW4gIT09IHRva2VuKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpbmZvLnJlc29sdmVkID0gdmFsdWU7XG4gICAgICAgIGxldCBjaGlsZF9jdHggPSBpbmZvLmN0eDtcbiAgICAgICAgaWYgKGtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjaGlsZF9jdHggPSBjaGlsZF9jdHguc2xpY2UoKTtcbiAgICAgICAgICAgIGNoaWxkX2N0eFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYmxvY2sgPSB0eXBlICYmIChpbmZvLmN1cnJlbnQgPSB0eXBlKShjaGlsZF9jdHgpO1xuICAgICAgICBsZXQgbmVlZHNfZmx1c2ggPSBmYWxzZTtcbiAgICAgICAgaWYgKGluZm8uYmxvY2spIHtcbiAgICAgICAgICAgIGlmIChpbmZvLmJsb2Nrcykge1xuICAgICAgICAgICAgICAgIGluZm8uYmxvY2tzLmZvckVhY2goKGJsb2NrLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpICE9PSBpbmRleCAmJiBibG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBfb3V0cm9zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uX291dChibG9jaywgMSwgMSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmZvLmJsb2Nrc1tpXSA9PT0gYmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mby5ibG9ja3NbaV0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfb3V0cm9zKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGluZm8uYmxvY2suZCgxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJsb2NrLmMoKTtcbiAgICAgICAgICAgIHRyYW5zaXRpb25faW4oYmxvY2ssIDEpO1xuICAgICAgICAgICAgYmxvY2subShpbmZvLm1vdW50KCksIGluZm8uYW5jaG9yKTtcbiAgICAgICAgICAgIG5lZWRzX2ZsdXNoID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpbmZvLmJsb2NrID0gYmxvY2s7XG4gICAgICAgIGlmIChpbmZvLmJsb2NrcylcbiAgICAgICAgICAgIGluZm8uYmxvY2tzW2luZGV4XSA9IGJsb2NrO1xuICAgICAgICBpZiAobmVlZHNfZmx1c2gpIHtcbiAgICAgICAgICAgIGZsdXNoKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzX3Byb21pc2UocHJvbWlzZSkpIHtcbiAgICAgICAgY29uc3QgY3VycmVudF9jb21wb25lbnQgPSBnZXRfY3VycmVudF9jb21wb25lbnQoKTtcbiAgICAgICAgcHJvbWlzZS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjdXJyZW50X2NvbXBvbmVudCk7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby50aGVuLCAxLCBpbmZvLnZhbHVlLCB2YWx1ZSk7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQobnVsbCk7XG4gICAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjdXJyZW50X2NvbXBvbmVudCk7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby5jYXRjaCwgMiwgaW5mby5lcnJvciwgZXJyb3IpO1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KG51bGwpO1xuICAgICAgICAgICAgaWYgKCFpbmZvLmhhc0NhdGNoKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBpZiB3ZSBwcmV2aW91c2x5IGhhZCBhIHRoZW4vY2F0Y2ggYmxvY2ssIGRlc3Ryb3kgaXRcbiAgICAgICAgaWYgKGluZm8uY3VycmVudCAhPT0gaW5mby5wZW5kaW5nKSB7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby5wZW5kaW5nLCAwKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAoaW5mby5jdXJyZW50ICE9PSBpbmZvLnRoZW4pIHtcbiAgICAgICAgICAgIHVwZGF0ZShpbmZvLnRoZW4sIDEsIGluZm8udmFsdWUsIHByb21pc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaW5mby5yZXNvbHZlZCA9IHByb21pc2U7XG4gICAgfVxufVxuZnVuY3Rpb24gdXBkYXRlX2F3YWl0X2Jsb2NrX2JyYW5jaChpbmZvLCBjdHgsIGRpcnR5KSB7XG4gICAgY29uc3QgY2hpbGRfY3R4ID0gY3R4LnNsaWNlKCk7XG4gICAgY29uc3QgeyByZXNvbHZlZCB9ID0gaW5mbztcbiAgICBpZiAoaW5mby5jdXJyZW50ID09PSBpbmZvLnRoZW4pIHtcbiAgICAgICAgY2hpbGRfY3R4W2luZm8udmFsdWVdID0gcmVzb2x2ZWQ7XG4gICAgfVxuICAgIGlmIChpbmZvLmN1cnJlbnQgPT09IGluZm8uY2F0Y2gpIHtcbiAgICAgICAgY2hpbGRfY3R4W2luZm8uZXJyb3JdID0gcmVzb2x2ZWQ7XG4gICAgfVxuICAgIGluZm8uYmxvY2sucChjaGlsZF9jdHgsIGRpcnR5KTtcbn1cblxuZnVuY3Rpb24gZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgYmxvY2suZCgxKTtcbiAgICBsb29rdXAuZGVsZXRlKGJsb2NrLmtleSk7XG59XG5mdW5jdGlvbiBvdXRyb19hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgdHJhbnNpdGlvbl9vdXQoYmxvY2ssIDEsIDEsICgpID0+IHtcbiAgICAgICAgbG9va3VwLmRlbGV0ZShibG9jay5rZXkpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZml4X2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApIHtcbiAgICBibG9jay5mKCk7XG4gICAgZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKTtcbn1cbmZ1bmN0aW9uIGZpeF9hbmRfb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIGJsb2NrLmYoKTtcbiAgICBvdXRyb19hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZV9rZXllZF9lYWNoKG9sZF9ibG9ja3MsIGRpcnR5LCBnZXRfa2V5LCBkeW5hbWljLCBjdHgsIGxpc3QsIGxvb2t1cCwgbm9kZSwgZGVzdHJveSwgY3JlYXRlX2VhY2hfYmxvY2ssIG5leHQsIGdldF9jb250ZXh0KSB7XG4gICAgbGV0IG8gPSBvbGRfYmxvY2tzLmxlbmd0aDtcbiAgICBsZXQgbiA9IGxpc3QubGVuZ3RoO1xuICAgIGxldCBpID0gbztcbiAgICBjb25zdCBvbGRfaW5kZXhlcyA9IHt9O1xuICAgIHdoaWxlIChpLS0pXG4gICAgICAgIG9sZF9pbmRleGVzW29sZF9ibG9ja3NbaV0ua2V5XSA9IGk7XG4gICAgY29uc3QgbmV3X2Jsb2NrcyA9IFtdO1xuICAgIGNvbnN0IG5ld19sb29rdXAgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgZGVsdGFzID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IHVwZGF0ZXMgPSBbXTtcbiAgICBpID0gbjtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkX2N0eCA9IGdldF9jb250ZXh0KGN0eCwgbGlzdCwgaSk7XG4gICAgICAgIGNvbnN0IGtleSA9IGdldF9rZXkoY2hpbGRfY3R4KTtcbiAgICAgICAgbGV0IGJsb2NrID0gbG9va3VwLmdldChrZXkpO1xuICAgICAgICBpZiAoIWJsb2NrKSB7XG4gICAgICAgICAgICBibG9jayA9IGNyZWF0ZV9lYWNoX2Jsb2NrKGtleSwgY2hpbGRfY3R4KTtcbiAgICAgICAgICAgIGJsb2NrLmMoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkeW5hbWljKSB7XG4gICAgICAgICAgICAvLyBkZWZlciB1cGRhdGVzIHVudGlsIGFsbCB0aGUgRE9NIHNodWZmbGluZyBpcyBkb25lXG4gICAgICAgICAgICB1cGRhdGVzLnB1c2goKCkgPT4gYmxvY2sucChjaGlsZF9jdHgsIGRpcnR5KSk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3X2xvb2t1cC5zZXQoa2V5LCBuZXdfYmxvY2tzW2ldID0gYmxvY2spO1xuICAgICAgICBpZiAoa2V5IGluIG9sZF9pbmRleGVzKVxuICAgICAgICAgICAgZGVsdGFzLnNldChrZXksIE1hdGguYWJzKGkgLSBvbGRfaW5kZXhlc1trZXldKSk7XG4gICAgfVxuICAgIGNvbnN0IHdpbGxfbW92ZSA9IG5ldyBTZXQoKTtcbiAgICBjb25zdCBkaWRfbW92ZSA9IG5ldyBTZXQoKTtcbiAgICBmdW5jdGlvbiBpbnNlcnQoYmxvY2spIHtcbiAgICAgICAgdHJhbnNpdGlvbl9pbihibG9jaywgMSk7XG4gICAgICAgIGJsb2NrLm0obm9kZSwgbmV4dCk7XG4gICAgICAgIGxvb2t1cC5zZXQoYmxvY2sua2V5LCBibG9jayk7XG4gICAgICAgIG5leHQgPSBibG9jay5maXJzdDtcbiAgICAgICAgbi0tO1xuICAgIH1cbiAgICB3aGlsZSAobyAmJiBuKSB7XG4gICAgICAgIGNvbnN0IG5ld19ibG9jayA9IG5ld19ibG9ja3NbbiAtIDFdO1xuICAgICAgICBjb25zdCBvbGRfYmxvY2sgPSBvbGRfYmxvY2tzW28gLSAxXTtcbiAgICAgICAgY29uc3QgbmV3X2tleSA9IG5ld19ibG9jay5rZXk7XG4gICAgICAgIGNvbnN0IG9sZF9rZXkgPSBvbGRfYmxvY2sua2V5O1xuICAgICAgICBpZiAobmV3X2Jsb2NrID09PSBvbGRfYmxvY2spIHtcbiAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgICAgICAgIG5leHQgPSBuZXdfYmxvY2suZmlyc3Q7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgICAgICBuLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIW5ld19sb29rdXAuaGFzKG9sZF9rZXkpKSB7XG4gICAgICAgICAgICAvLyByZW1vdmUgb2xkIGJsb2NrXG4gICAgICAgICAgICBkZXN0cm95KG9sZF9ibG9jaywgbG9va3VwKTtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghbG9va3VwLmhhcyhuZXdfa2V5KSB8fCB3aWxsX21vdmUuaGFzKG5ld19rZXkpKSB7XG4gICAgICAgICAgICBpbnNlcnQobmV3X2Jsb2NrKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkaWRfbW92ZS5oYXMob2xkX2tleSkpIHtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkZWx0YXMuZ2V0KG5ld19rZXkpID4gZGVsdGFzLmdldChvbGRfa2V5KSkge1xuICAgICAgICAgICAgZGlkX21vdmUuYWRkKG5ld19rZXkpO1xuICAgICAgICAgICAgaW5zZXJ0KG5ld19ibG9jayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB3aWxsX21vdmUuYWRkKG9sZF9rZXkpO1xuICAgICAgICAgICAgby0tO1xuICAgICAgICB9XG4gICAgfVxuICAgIHdoaWxlIChvLS0pIHtcbiAgICAgICAgY29uc3Qgb2xkX2Jsb2NrID0gb2xkX2Jsb2Nrc1tvXTtcbiAgICAgICAgaWYgKCFuZXdfbG9va3VwLmhhcyhvbGRfYmxvY2sua2V5KSlcbiAgICAgICAgICAgIGRlc3Ryb3kob2xkX2Jsb2NrLCBsb29rdXApO1xuICAgIH1cbiAgICB3aGlsZSAobilcbiAgICAgICAgaW5zZXJ0KG5ld19ibG9ja3NbbiAtIDFdKTtcbiAgICBydW5fYWxsKHVwZGF0ZXMpO1xuICAgIHJldHVybiBuZXdfYmxvY2tzO1xufVxuZnVuY3Rpb24gdmFsaWRhdGVfZWFjaF9rZXlzKGN0eCwgbGlzdCwgZ2V0X2NvbnRleHQsIGdldF9rZXkpIHtcbiAgICBjb25zdCBrZXlzID0gbmV3IFNldCgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBrZXkgPSBnZXRfa2V5KGdldF9jb250ZXh0KGN0eCwgbGlzdCwgaSkpO1xuICAgICAgICBpZiAoa2V5cy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgaGF2ZSBkdXBsaWNhdGUga2V5cyBpbiBhIGtleWVkIGVhY2gnKTtcbiAgICAgICAgfVxuICAgICAgICBrZXlzLmFkZChrZXkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0X3NwcmVhZF91cGRhdGUobGV2ZWxzLCB1cGRhdGVzKSB7XG4gICAgY29uc3QgdXBkYXRlID0ge307XG4gICAgY29uc3QgdG9fbnVsbF9vdXQgPSB7fTtcbiAgICBjb25zdCBhY2NvdW50ZWRfZm9yID0geyAkJHNjb3BlOiAxIH07XG4gICAgbGV0IGkgPSBsZXZlbHMubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgY29uc3QgbyA9IGxldmVsc1tpXTtcbiAgICAgICAgY29uc3QgbiA9IHVwZGF0ZXNbaV07XG4gICAgICAgIGlmIChuKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBvKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoa2V5IGluIG4pKVxuICAgICAgICAgICAgICAgICAgICB0b19udWxsX291dFtrZXldID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG4pIHtcbiAgICAgICAgICAgICAgICBpZiAoIWFjY291bnRlZF9mb3Jba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVba2V5XSA9IG5ba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgYWNjb3VudGVkX2ZvcltrZXldID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXZlbHNbaV0gPSBuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbykge1xuICAgICAgICAgICAgICAgIGFjY291bnRlZF9mb3Jba2V5XSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdG9fbnVsbF9vdXQpIHtcbiAgICAgICAgaWYgKCEoa2V5IGluIHVwZGF0ZSkpXG4gICAgICAgICAgICB1cGRhdGVba2V5XSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHVwZGF0ZTtcbn1cbmZ1bmN0aW9uIGdldF9zcHJlYWRfb2JqZWN0KHNwcmVhZF9wcm9wcykge1xuICAgIHJldHVybiB0eXBlb2Ygc3ByZWFkX3Byb3BzID09PSAnb2JqZWN0JyAmJiBzcHJlYWRfcHJvcHMgIT09IG51bGwgPyBzcHJlYWRfcHJvcHMgOiB7fTtcbn1cblxuY29uc3QgX2Jvb2xlYW5fYXR0cmlidXRlcyA9IFtcbiAgICAnYWxsb3dmdWxsc2NyZWVuJyxcbiAgICAnYWxsb3dwYXltZW50cmVxdWVzdCcsXG4gICAgJ2FzeW5jJyxcbiAgICAnYXV0b2ZvY3VzJyxcbiAgICAnYXV0b3BsYXknLFxuICAgICdjaGVja2VkJyxcbiAgICAnY29udHJvbHMnLFxuICAgICdkZWZhdWx0JyxcbiAgICAnZGVmZXInLFxuICAgICdkaXNhYmxlZCcsXG4gICAgJ2Zvcm1ub3ZhbGlkYXRlJyxcbiAgICAnaGlkZGVuJyxcbiAgICAnaW5lcnQnLFxuICAgICdpc21hcCcsXG4gICAgJ2xvb3AnLFxuICAgICdtdWx0aXBsZScsXG4gICAgJ211dGVkJyxcbiAgICAnbm9tb2R1bGUnLFxuICAgICdub3ZhbGlkYXRlJyxcbiAgICAnb3BlbicsXG4gICAgJ3BsYXlzaW5saW5lJyxcbiAgICAncmVhZG9ubHknLFxuICAgICdyZXF1aXJlZCcsXG4gICAgJ3JldmVyc2VkJyxcbiAgICAnc2VsZWN0ZWQnXG5dO1xuLyoqXG4gKiBMaXN0IG9mIEhUTUwgYm9vbGVhbiBhdHRyaWJ1dGVzIChlLmcuIGA8aW5wdXQgZGlzYWJsZWQ+YCkuXG4gKiBTb3VyY2U6IGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2luZGljZXMuaHRtbFxuICovXG5jb25zdCBib29sZWFuX2F0dHJpYnV0ZXMgPSBuZXcgU2V0KFsuLi5fYm9vbGVhbl9hdHRyaWJ1dGVzXSk7XG5cbi8qKiByZWdleCBvZiBhbGwgaHRtbCB2b2lkIGVsZW1lbnQgbmFtZXMgKi9cbmNvbnN0IHZvaWRfZWxlbWVudF9uYW1lcyA9IC9eKD86YXJlYXxiYXNlfGJyfGNvbHxjb21tYW5kfGVtYmVkfGhyfGltZ3xpbnB1dHxrZXlnZW58bGlua3xtZXRhfHBhcmFtfHNvdXJjZXx0cmFja3x3YnIpJC87XG5mdW5jdGlvbiBpc192b2lkKG5hbWUpIHtcbiAgICByZXR1cm4gdm9pZF9lbGVtZW50X25hbWVzLnRlc3QobmFtZSkgfHwgbmFtZS50b0xvd2VyQ2FzZSgpID09PSAnIWRvY3R5cGUnO1xufVxuXG5jb25zdCBpbnZhbGlkX2F0dHJpYnV0ZV9uYW1lX2NoYXJhY3RlciA9IC9bXFxzJ1wiPi89XFx1e0ZERDB9LVxcdXtGREVGfVxcdXtGRkZFfVxcdXtGRkZGfVxcdXsxRkZGRX1cXHV7MUZGRkZ9XFx1ezJGRkZFfVxcdXsyRkZGRn1cXHV7M0ZGRkV9XFx1ezNGRkZGfVxcdXs0RkZGRX1cXHV7NEZGRkZ9XFx1ezVGRkZFfVxcdXs1RkZGRn1cXHV7NkZGRkV9XFx1ezZGRkZGfVxcdXs3RkZGRX1cXHV7N0ZGRkZ9XFx1ezhGRkZFfVxcdXs4RkZGRn1cXHV7OUZGRkV9XFx1ezlGRkZGfVxcdXtBRkZGRX1cXHV7QUZGRkZ9XFx1e0JGRkZFfVxcdXtCRkZGRn1cXHV7Q0ZGRkV9XFx1e0NGRkZGfVxcdXtERkZGRX1cXHV7REZGRkZ9XFx1e0VGRkZFfVxcdXtFRkZGRn1cXHV7RkZGRkV9XFx1e0ZGRkZGfVxcdXsxMEZGRkV9XFx1ezEwRkZGRn1dL3U7XG4vLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zeW50YXguaHRtbCNhdHRyaWJ1dGVzLTJcbi8vIGh0dHBzOi8vaW5mcmEuc3BlYy53aGF0d2cub3JnLyNub25jaGFyYWN0ZXJcbmZ1bmN0aW9uIHNwcmVhZChhcmdzLCBhdHRyc190b19hZGQpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gT2JqZWN0LmFzc2lnbih7fSwgLi4uYXJncyk7XG4gICAgaWYgKGF0dHJzX3RvX2FkZCkge1xuICAgICAgICBjb25zdCBjbGFzc2VzX3RvX2FkZCA9IGF0dHJzX3RvX2FkZC5jbGFzc2VzO1xuICAgICAgICBjb25zdCBzdHlsZXNfdG9fYWRkID0gYXR0cnNfdG9fYWRkLnN0eWxlcztcbiAgICAgICAgaWYgKGNsYXNzZXNfdG9fYWRkKSB7XG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlcy5jbGFzcyA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcy5jbGFzcyA9IGNsYXNzZXNfdG9fYWRkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcy5jbGFzcyArPSAnICcgKyBjbGFzc2VzX3RvX2FkZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoc3R5bGVzX3RvX2FkZCkge1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXMuc3R5bGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMuc3R5bGUgPSBzdHlsZV9vYmplY3RfdG9fc3RyaW5nKHN0eWxlc190b19hZGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcy5zdHlsZSA9IHN0eWxlX29iamVjdF90b19zdHJpbmcobWVyZ2Vfc3NyX3N0eWxlcyhhdHRyaWJ1dGVzLnN0eWxlLCBzdHlsZXNfdG9fYWRkKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IHN0ciA9ICcnO1xuICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgIGlmIChpbnZhbGlkX2F0dHJpYnV0ZV9uYW1lX2NoYXJhY3Rlci50ZXN0KG5hbWUpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGF0dHJpYnV0ZXNbbmFtZV07XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdHJ1ZSlcbiAgICAgICAgICAgIHN0ciArPSAnICcgKyBuYW1lO1xuICAgICAgICBlbHNlIGlmIChib29sZWFuX2F0dHJpYnV0ZXMuaGFzKG5hbWUudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSlcbiAgICAgICAgICAgICAgICBzdHIgKz0gJyAnICsgbmFtZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBzdHIgKz0gYCAke25hbWV9PVwiJHt2YWx1ZX1cImA7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gc3RyO1xufVxuZnVuY3Rpb24gbWVyZ2Vfc3NyX3N0eWxlcyhzdHlsZV9hdHRyaWJ1dGUsIHN0eWxlX2RpcmVjdGl2ZSkge1xuICAgIGNvbnN0IHN0eWxlX29iamVjdCA9IHt9O1xuICAgIGZvciAoY29uc3QgaW5kaXZpZHVhbF9zdHlsZSBvZiBzdHlsZV9hdHRyaWJ1dGUuc3BsaXQoJzsnKSkge1xuICAgICAgICBjb25zdCBjb2xvbl9pbmRleCA9IGluZGl2aWR1YWxfc3R5bGUuaW5kZXhPZignOicpO1xuICAgICAgICBjb25zdCBuYW1lID0gaW5kaXZpZHVhbF9zdHlsZS5zbGljZSgwLCBjb2xvbl9pbmRleCkudHJpbSgpO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGluZGl2aWR1YWxfc3R5bGUuc2xpY2UoY29sb25faW5kZXggKyAxKS50cmltKCk7XG4gICAgICAgIGlmICghbmFtZSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBzdHlsZV9vYmplY3RbbmFtZV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBuYW1lIGluIHN0eWxlX2RpcmVjdGl2ZSkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHN0eWxlX2RpcmVjdGl2ZVtuYW1lXTtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICBzdHlsZV9vYmplY3RbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBzdHlsZV9vYmplY3RbbmFtZV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0eWxlX29iamVjdDtcbn1cbmNvbnN0IEFUVFJfUkVHRVggPSAvWyZcIl0vZztcbmNvbnN0IENPTlRFTlRfUkVHRVggPSAvWyY8XS9nO1xuLyoqXG4gKiBOb3RlOiB0aGlzIG1ldGhvZCBpcyBwZXJmb3JtYW5jZSBzZW5zaXRpdmUgYW5kIGhhcyBiZWVuIG9wdGltaXplZFxuICogaHR0cHM6Ly9naXRodWIuY29tL3N2ZWx0ZWpzL3N2ZWx0ZS9wdWxsLzU3MDFcbiAqL1xuZnVuY3Rpb24gZXNjYXBlKHZhbHVlLCBpc19hdHRyID0gZmFsc2UpIHtcbiAgICBjb25zdCBzdHIgPSBTdHJpbmcodmFsdWUpO1xuICAgIGNvbnN0IHBhdHRlcm4gPSBpc19hdHRyID8gQVRUUl9SRUdFWCA6IENPTlRFTlRfUkVHRVg7XG4gICAgcGF0dGVybi5sYXN0SW5kZXggPSAwO1xuICAgIGxldCBlc2NhcGVkID0gJyc7XG4gICAgbGV0IGxhc3QgPSAwO1xuICAgIHdoaWxlIChwYXR0ZXJuLnRlc3Qoc3RyKSkge1xuICAgICAgICBjb25zdCBpID0gcGF0dGVybi5sYXN0SW5kZXggLSAxO1xuICAgICAgICBjb25zdCBjaCA9IHN0cltpXTtcbiAgICAgICAgZXNjYXBlZCArPSBzdHIuc3Vic3RyaW5nKGxhc3QsIGkpICsgKGNoID09PSAnJicgPyAnJmFtcDsnIDogKGNoID09PSAnXCInID8gJyZxdW90OycgOiAnJmx0OycpKTtcbiAgICAgICAgbGFzdCA9IGkgKyAxO1xuICAgIH1cbiAgICByZXR1cm4gZXNjYXBlZCArIHN0ci5zdWJzdHJpbmcobGFzdCk7XG59XG5mdW5jdGlvbiBlc2NhcGVfYXR0cmlidXRlX3ZhbHVlKHZhbHVlKSB7XG4gICAgLy8ga2VlcCBib29sZWFucywgbnVsbCwgYW5kIHVuZGVmaW5lZCBmb3IgdGhlIHNha2Ugb2YgYHNwcmVhZGBcbiAgICBjb25zdCBzaG91bGRfZXNjYXBlID0gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jyk7XG4gICAgcmV0dXJuIHNob3VsZF9lc2NhcGUgPyBlc2NhcGUodmFsdWUsIHRydWUpIDogdmFsdWU7XG59XG5mdW5jdGlvbiBlc2NhcGVfb2JqZWN0KG9iaikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xuICAgICAgICByZXN1bHRba2V5XSA9IGVzY2FwZV9hdHRyaWJ1dGVfdmFsdWUob2JqW2tleV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gZWFjaChpdGVtcywgZm4pIHtcbiAgICBsZXQgc3RyID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBzdHIgKz0gZm4oaXRlbXNbaV0sIGkpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xufVxuY29uc3QgbWlzc2luZ19jb21wb25lbnQgPSB7XG4gICAgJCRyZW5kZXI6ICgpID0+ICcnXG59O1xuZnVuY3Rpb24gdmFsaWRhdGVfY29tcG9uZW50KGNvbXBvbmVudCwgbmFtZSkge1xuICAgIGlmICghY29tcG9uZW50IHx8ICFjb21wb25lbnQuJCRyZW5kZXIpIHtcbiAgICAgICAgaWYgKG5hbWUgPT09ICdzdmVsdGU6Y29tcG9uZW50JylcbiAgICAgICAgICAgIG5hbWUgKz0gJyB0aGlzPXsuLi59JztcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGA8JHtuYW1lfT4gaXMgbm90IGEgdmFsaWQgU1NSIGNvbXBvbmVudC4gWW91IG1heSBuZWVkIHRvIHJldmlldyB5b3VyIGJ1aWxkIGNvbmZpZyB0byBlbnN1cmUgdGhhdCBkZXBlbmRlbmNpZXMgYXJlIGNvbXBpbGVkLCByYXRoZXIgdGhhbiBpbXBvcnRlZCBhcyBwcmUtY29tcGlsZWQgbW9kdWxlcy4gT3RoZXJ3aXNlIHlvdSBtYXkgbmVlZCB0byBmaXggYSA8JHtuYW1lfT4uYCk7XG4gICAgfVxuICAgIHJldHVybiBjb21wb25lbnQ7XG59XG5mdW5jdGlvbiBkZWJ1ZyhmaWxlLCBsaW5lLCBjb2x1bW4sIHZhbHVlcykge1xuICAgIGNvbnNvbGUubG9nKGB7QGRlYnVnfSAke2ZpbGUgPyBmaWxlICsgJyAnIDogJyd9KCR7bGluZX06JHtjb2x1bW59KWApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmxvZyh2YWx1ZXMpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICByZXR1cm4gJyc7XG59XG5sZXQgb25fZGVzdHJveTtcbmZ1bmN0aW9uIGNyZWF0ZV9zc3JfY29tcG9uZW50KGZuKSB7XG4gICAgZnVuY3Rpb24gJCRyZW5kZXIocmVzdWx0LCBwcm9wcywgYmluZGluZ3MsIHNsb3RzLCBjb250ZXh0KSB7XG4gICAgICAgIGNvbnN0IHBhcmVudF9jb21wb25lbnQgPSBjdXJyZW50X2NvbXBvbmVudDtcbiAgICAgICAgY29uc3QgJCQgPSB7XG4gICAgICAgICAgICBvbl9kZXN0cm95LFxuICAgICAgICAgICAgY29udGV4dDogbmV3IE1hcChjb250ZXh0IHx8IChwYXJlbnRfY29tcG9uZW50ID8gcGFyZW50X2NvbXBvbmVudC4kJC5jb250ZXh0IDogW10pKSxcbiAgICAgICAgICAgIC8vIHRoZXNlIHdpbGwgYmUgaW1tZWRpYXRlbHkgZGlzY2FyZGVkXG4gICAgICAgICAgICBvbl9tb3VudDogW10sXG4gICAgICAgICAgICBiZWZvcmVfdXBkYXRlOiBbXSxcbiAgICAgICAgICAgIGFmdGVyX3VwZGF0ZTogW10sXG4gICAgICAgICAgICBjYWxsYmFja3M6IGJsYW5rX29iamVjdCgpXG4gICAgICAgIH07XG4gICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudCh7ICQkIH0pO1xuICAgICAgICBjb25zdCBodG1sID0gZm4ocmVzdWx0LCBwcm9wcywgYmluZGluZ3MsIHNsb3RzKTtcbiAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KHBhcmVudF9jb21wb25lbnQpO1xuICAgICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVuZGVyOiAocHJvcHMgPSB7fSwgeyAkJHNsb3RzID0ge30sIGNvbnRleHQgPSBuZXcgTWFwKCkgfSA9IHt9KSA9PiB7XG4gICAgICAgICAgICBvbl9kZXN0cm95ID0gW107XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB7IHRpdGxlOiAnJywgaGVhZDogJycsIGNzczogbmV3IFNldCgpIH07XG4gICAgICAgICAgICBjb25zdCBodG1sID0gJCRyZW5kZXIocmVzdWx0LCBwcm9wcywge30sICQkc2xvdHMsIGNvbnRleHQpO1xuICAgICAgICAgICAgcnVuX2FsbChvbl9kZXN0cm95KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaHRtbCxcbiAgICAgICAgICAgICAgICBjc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogQXJyYXkuZnJvbShyZXN1bHQuY3NzKS5tYXAoY3NzID0+IGNzcy5jb2RlKS5qb2luKCdcXG4nKSxcbiAgICAgICAgICAgICAgICAgICAgbWFwOiBudWxsIC8vIFRPRE9cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGhlYWQ6IHJlc3VsdC50aXRsZSArIHJlc3VsdC5oZWFkXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICAkJHJlbmRlclxuICAgIH07XG59XG5mdW5jdGlvbiBhZGRfYXR0cmlidXRlKG5hbWUsIHZhbHVlLCBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwgfHwgKGJvb2xlYW4gJiYgIXZhbHVlKSlcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIGNvbnN0IGFzc2lnbm1lbnQgPSAoYm9vbGVhbiAmJiB2YWx1ZSA9PT0gdHJ1ZSkgPyAnJyA6IGA9XCIke2VzY2FwZSh2YWx1ZSwgdHJ1ZSl9XCJgO1xuICAgIHJldHVybiBgICR7bmFtZX0ke2Fzc2lnbm1lbnR9YDtcbn1cbmZ1bmN0aW9uIGFkZF9jbGFzc2VzKGNsYXNzZXMpIHtcbiAgICByZXR1cm4gY2xhc3NlcyA/IGAgY2xhc3M9XCIke2NsYXNzZXN9XCJgIDogJyc7XG59XG5mdW5jdGlvbiBzdHlsZV9vYmplY3RfdG9fc3RyaW5nKHN0eWxlX29iamVjdCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhzdHlsZV9vYmplY3QpXG4gICAgICAgIC5maWx0ZXIoa2V5ID0+IHN0eWxlX29iamVjdFtrZXldKVxuICAgICAgICAubWFwKGtleSA9PiBgJHtrZXl9OiAke2VzY2FwZV9hdHRyaWJ1dGVfdmFsdWUoc3R5bGVfb2JqZWN0W2tleV0pfTtgKVxuICAgICAgICAuam9pbignICcpO1xufVxuZnVuY3Rpb24gYWRkX3N0eWxlcyhzdHlsZV9vYmplY3QpIHtcbiAgICBjb25zdCBzdHlsZXMgPSBzdHlsZV9vYmplY3RfdG9fc3RyaW5nKHN0eWxlX29iamVjdCk7XG4gICAgcmV0dXJuIHN0eWxlcyA/IGAgc3R5bGU9XCIke3N0eWxlc31cImAgOiAnJztcbn1cblxuZnVuY3Rpb24gYmluZChjb21wb25lbnQsIG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgaW5kZXggPSBjb21wb25lbnQuJCQucHJvcHNbbmFtZV07XG4gICAgaWYgKGluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29tcG9uZW50LiQkLmJvdW5kW2luZGV4XSA9IGNhbGxiYWNrO1xuICAgICAgICBjYWxsYmFjayhjb21wb25lbnQuJCQuY3R4W2luZGV4XSk7XG4gICAgfVxufVxuZnVuY3Rpb24gY3JlYXRlX2NvbXBvbmVudChibG9jaykge1xuICAgIGJsb2NrICYmIGJsb2NrLmMoKTtcbn1cbmZ1bmN0aW9uIGNsYWltX2NvbXBvbmVudChibG9jaywgcGFyZW50X25vZGVzKSB7XG4gICAgYmxvY2sgJiYgYmxvY2subChwYXJlbnRfbm9kZXMpO1xufVxuZnVuY3Rpb24gbW91bnRfY29tcG9uZW50KGNvbXBvbmVudCwgdGFyZ2V0LCBhbmNob3IsIGN1c3RvbUVsZW1lbnQpIHtcbiAgICBjb25zdCB7IGZyYWdtZW50LCBhZnRlcl91cGRhdGUgfSA9IGNvbXBvbmVudC4kJDtcbiAgICBmcmFnbWVudCAmJiBmcmFnbWVudC5tKHRhcmdldCwgYW5jaG9yKTtcbiAgICBpZiAoIWN1c3RvbUVsZW1lbnQpIHtcbiAgICAgICAgLy8gb25Nb3VudCBoYXBwZW5zIGJlZm9yZSB0aGUgaW5pdGlhbCBhZnRlclVwZGF0ZVxuICAgICAgICBhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5ld19vbl9kZXN0cm95ID0gY29tcG9uZW50LiQkLm9uX21vdW50Lm1hcChydW4pLmZpbHRlcihpc19mdW5jdGlvbik7XG4gICAgICAgICAgICAvLyBpZiB0aGUgY29tcG9uZW50IHdhcyBkZXN0cm95ZWQgaW1tZWRpYXRlbHlcbiAgICAgICAgICAgIC8vIGl0IHdpbGwgdXBkYXRlIHRoZSBgJCQub25fZGVzdHJveWAgcmVmZXJlbmNlIHRvIGBudWxsYC5cbiAgICAgICAgICAgIC8vIHRoZSBkZXN0cnVjdHVyZWQgb25fZGVzdHJveSBtYXkgc3RpbGwgcmVmZXJlbmNlIHRvIHRoZSBvbGQgYXJyYXlcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuJCQub25fZGVzdHJveSkge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC4kJC5vbl9kZXN0cm95LnB1c2goLi4ubmV3X29uX2Rlc3Ryb3kpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gRWRnZSBjYXNlIC0gY29tcG9uZW50IHdhcyBkZXN0cm95ZWQgaW1tZWRpYXRlbHksXG4gICAgICAgICAgICAgICAgLy8gbW9zdCBsaWtlbHkgYXMgYSByZXN1bHQgb2YgYSBiaW5kaW5nIGluaXRpYWxpc2luZ1xuICAgICAgICAgICAgICAgIHJ1bl9hbGwobmV3X29uX2Rlc3Ryb3kpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29tcG9uZW50LiQkLm9uX21vdW50ID0gW107XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhZnRlcl91cGRhdGUuZm9yRWFjaChhZGRfcmVuZGVyX2NhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGRlc3Ryb3lfY29tcG9uZW50KGNvbXBvbmVudCwgZGV0YWNoaW5nKSB7XG4gICAgY29uc3QgJCQgPSBjb21wb25lbnQuJCQ7XG4gICAgaWYgKCQkLmZyYWdtZW50ICE9PSBudWxsKSB7XG4gICAgICAgIGZsdXNoX3JlbmRlcl9jYWxsYmFja3MoJCQuYWZ0ZXJfdXBkYXRlKTtcbiAgICAgICAgcnVuX2FsbCgkJC5vbl9kZXN0cm95KTtcbiAgICAgICAgJCQuZnJhZ21lbnQgJiYgJCQuZnJhZ21lbnQuZChkZXRhY2hpbmcpO1xuICAgICAgICAvLyBUT0RPIG51bGwgb3V0IG90aGVyIHJlZnMsIGluY2x1ZGluZyBjb21wb25lbnQuJCQgKGJ1dCBuZWVkIHRvXG4gICAgICAgIC8vIHByZXNlcnZlIGZpbmFsIHN0YXRlPylcbiAgICAgICAgJCQub25fZGVzdHJveSA9ICQkLmZyYWdtZW50ID0gbnVsbDtcbiAgICAgICAgJCQuY3R4ID0gW107XG4gICAgfVxufVxuZnVuY3Rpb24gbWFrZV9kaXJ0eShjb21wb25lbnQsIGkpIHtcbiAgICBpZiAoY29tcG9uZW50LiQkLmRpcnR5WzBdID09PSAtMSkge1xuICAgICAgICBkaXJ0eV9jb21wb25lbnRzLnB1c2goY29tcG9uZW50KTtcbiAgICAgICAgc2NoZWR1bGVfdXBkYXRlKCk7XG4gICAgICAgIGNvbXBvbmVudC4kJC5kaXJ0eS5maWxsKDApO1xuICAgIH1cbiAgICBjb21wb25lbnQuJCQuZGlydHlbKGkgLyAzMSkgfCAwXSB8PSAoMSA8PCAoaSAlIDMxKSk7XG59XG5mdW5jdGlvbiBpbml0KGNvbXBvbmVudCwgb3B0aW9ucywgaW5zdGFuY2UsIGNyZWF0ZV9mcmFnbWVudCwgbm90X2VxdWFsLCBwcm9wcywgYXBwZW5kX3N0eWxlcywgZGlydHkgPSBbLTFdKSB7XG4gICAgY29uc3QgcGFyZW50X2NvbXBvbmVudCA9IGN1cnJlbnRfY29tcG9uZW50O1xuICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjb21wb25lbnQpO1xuICAgIGNvbnN0ICQkID0gY29tcG9uZW50LiQkID0ge1xuICAgICAgICBmcmFnbWVudDogbnVsbCxcbiAgICAgICAgY3R4OiBbXSxcbiAgICAgICAgLy8gc3RhdGVcbiAgICAgICAgcHJvcHMsXG4gICAgICAgIHVwZGF0ZTogbm9vcCxcbiAgICAgICAgbm90X2VxdWFsLFxuICAgICAgICBib3VuZDogYmxhbmtfb2JqZWN0KCksXG4gICAgICAgIC8vIGxpZmVjeWNsZVxuICAgICAgICBvbl9tb3VudDogW10sXG4gICAgICAgIG9uX2Rlc3Ryb3k6IFtdLFxuICAgICAgICBvbl9kaXNjb25uZWN0OiBbXSxcbiAgICAgICAgYmVmb3JlX3VwZGF0ZTogW10sXG4gICAgICAgIGFmdGVyX3VwZGF0ZTogW10sXG4gICAgICAgIGNvbnRleHQ6IG5ldyBNYXAob3B0aW9ucy5jb250ZXh0IHx8IChwYXJlbnRfY29tcG9uZW50ID8gcGFyZW50X2NvbXBvbmVudC4kJC5jb250ZXh0IDogW10pKSxcbiAgICAgICAgLy8gZXZlcnl0aGluZyBlbHNlXG4gICAgICAgIGNhbGxiYWNrczogYmxhbmtfb2JqZWN0KCksXG4gICAgICAgIGRpcnR5LFxuICAgICAgICBza2lwX2JvdW5kOiBmYWxzZSxcbiAgICAgICAgcm9vdDogb3B0aW9ucy50YXJnZXQgfHwgcGFyZW50X2NvbXBvbmVudC4kJC5yb290XG4gICAgfTtcbiAgICBhcHBlbmRfc3R5bGVzICYmIGFwcGVuZF9zdHlsZXMoJCQucm9vdCk7XG4gICAgbGV0IHJlYWR5ID0gZmFsc2U7XG4gICAgJCQuY3R4ID0gaW5zdGFuY2VcbiAgICAgICAgPyBpbnN0YW5jZShjb21wb25lbnQsIG9wdGlvbnMucHJvcHMgfHwge30sIChpLCByZXQsIC4uLnJlc3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcmVzdC5sZW5ndGggPyByZXN0WzBdIDogcmV0O1xuICAgICAgICAgICAgaWYgKCQkLmN0eCAmJiBub3RfZXF1YWwoJCQuY3R4W2ldLCAkJC5jdHhbaV0gPSB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoISQkLnNraXBfYm91bmQgJiYgJCQuYm91bmRbaV0pXG4gICAgICAgICAgICAgICAgICAgICQkLmJvdW5kW2ldKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAocmVhZHkpXG4gICAgICAgICAgICAgICAgICAgIG1ha2VfZGlydHkoY29tcG9uZW50LCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH0pXG4gICAgICAgIDogW107XG4gICAgJCQudXBkYXRlKCk7XG4gICAgcmVhZHkgPSB0cnVlO1xuICAgIHJ1bl9hbGwoJCQuYmVmb3JlX3VwZGF0ZSk7XG4gICAgLy8gYGZhbHNlYCBhcyBhIHNwZWNpYWwgY2FzZSBvZiBubyBET00gY29tcG9uZW50XG4gICAgJCQuZnJhZ21lbnQgPSBjcmVhdGVfZnJhZ21lbnQgPyBjcmVhdGVfZnJhZ21lbnQoJCQuY3R4KSA6IGZhbHNlO1xuICAgIGlmIChvcHRpb25zLnRhcmdldCkge1xuICAgICAgICBpZiAob3B0aW9ucy5oeWRyYXRlKSB7XG4gICAgICAgICAgICBzdGFydF9oeWRyYXRpbmcoKTtcbiAgICAgICAgICAgIGNvbnN0IG5vZGVzID0gY2hpbGRyZW4ob3B0aW9ucy50YXJnZXQpO1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50Lmwobm9kZXMpO1xuICAgICAgICAgICAgbm9kZXMuZm9yRWFjaChkZXRhY2gpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LmMoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5pbnRybylcbiAgICAgICAgICAgIHRyYW5zaXRpb25faW4oY29tcG9uZW50LiQkLmZyYWdtZW50KTtcbiAgICAgICAgbW91bnRfY29tcG9uZW50KGNvbXBvbmVudCwgb3B0aW9ucy50YXJnZXQsIG9wdGlvbnMuYW5jaG9yLCBvcHRpb25zLmN1c3RvbUVsZW1lbnQpO1xuICAgICAgICBlbmRfaHlkcmF0aW5nKCk7XG4gICAgICAgIGZsdXNoKCk7XG4gICAgfVxuICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChwYXJlbnRfY29tcG9uZW50KTtcbn1cbmxldCBTdmVsdGVFbGVtZW50O1xuaWYgKHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFN2ZWx0ZUVsZW1lbnQgPSBjbGFzcyBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICBjb25zdCB7IG9uX21vdW50IH0gPSB0aGlzLiQkO1xuICAgICAgICAgICAgdGhpcy4kJC5vbl9kaXNjb25uZWN0ID0gb25fbW91bnQubWFwKHJ1bikuZmlsdGVyKGlzX2Z1bmN0aW9uKTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmUgdG9kbzogaW1wcm92ZSB0eXBpbmdzXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLiQkLnNsb3R0ZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy4kJC5zbG90dGVkW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyLCBfb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzW2F0dHJdID0gbmV3VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICBydW5fYWxsKHRoaXMuJCQub25fZGlzY29ubmVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgJGRlc3Ryb3koKSB7XG4gICAgICAgICAgICBkZXN0cm95X2NvbXBvbmVudCh0aGlzLCAxKTtcbiAgICAgICAgICAgIHRoaXMuJGRlc3Ryb3kgPSBub29wO1xuICAgICAgICB9XG4gICAgICAgICRvbih0eXBlLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgLy8gVE9ETyBzaG91bGQgdGhpcyBkZWxlZ2F0ZSB0byBhZGRFdmVudExpc3RlbmVyP1xuICAgICAgICAgICAgaWYgKCFpc19mdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9vcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSB8fCAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gPSBbXSkpO1xuICAgICAgICAgICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgJHNldCgkJHByb3BzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy4kJHNldCAmJiAhaXNfZW1wdHkoJCRwcm9wcykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiQkLnNraXBfYm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuJCRzZXQoJCRwcm9wcyk7XG4gICAgICAgICAgICAgICAgdGhpcy4kJC5za2lwX2JvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBTdmVsdGUgY29tcG9uZW50cy4gVXNlZCB3aGVuIGRldj1mYWxzZS5cbiAqL1xuY2xhc3MgU3ZlbHRlQ29tcG9uZW50IHtcbiAgICAkZGVzdHJveSgpIHtcbiAgICAgICAgZGVzdHJveV9jb21wb25lbnQodGhpcywgMSk7XG4gICAgICAgIHRoaXMuJGRlc3Ryb3kgPSBub29wO1xuICAgIH1cbiAgICAkb24odHlwZSwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKCFpc19mdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgIHJldHVybiBub29wO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSB8fCAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gPSBbXSkpO1xuICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpXG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgICRzZXQoJCRwcm9wcykge1xuICAgICAgICBpZiAodGhpcy4kJHNldCAmJiAhaXNfZW1wdHkoJCRwcm9wcykpIHtcbiAgICAgICAgICAgIHRoaXMuJCQuc2tpcF9ib3VuZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLiQkc2V0KCQkcHJvcHMpO1xuICAgICAgICAgICAgdGhpcy4kJC5za2lwX2JvdW5kID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoX2Rldih0eXBlLCBkZXRhaWwpIHtcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGN1c3RvbV9ldmVudCh0eXBlLCBPYmplY3QuYXNzaWduKHsgdmVyc2lvbjogJzMuNTkuMicgfSwgZGV0YWlsKSwgeyBidWJibGVzOiB0cnVlIH0pKTtcbn1cbmZ1bmN0aW9uIGFwcGVuZF9kZXYodGFyZ2V0LCBub2RlKSB7XG4gICAgZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01JbnNlcnQnLCB7IHRhcmdldCwgbm9kZSB9KTtcbiAgICBhcHBlbmQodGFyZ2V0LCBub2RlKTtcbn1cbmZ1bmN0aW9uIGFwcGVuZF9oeWRyYXRpb25fZGV2KHRhcmdldCwgbm9kZSkge1xuICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NSW5zZXJ0JywgeyB0YXJnZXQsIG5vZGUgfSk7XG4gICAgYXBwZW5kX2h5ZHJhdGlvbih0YXJnZXQsIG5vZGUpO1xufVxuZnVuY3Rpb24gaW5zZXJ0X2Rldih0YXJnZXQsIG5vZGUsIGFuY2hvcikge1xuICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NSW5zZXJ0JywgeyB0YXJnZXQsIG5vZGUsIGFuY2hvciB9KTtcbiAgICBpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpO1xufVxuZnVuY3Rpb24gaW5zZXJ0X2h5ZHJhdGlvbl9kZXYodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTUluc2VydCcsIHsgdGFyZ2V0LCBub2RlLCBhbmNob3IgfSk7XG4gICAgaW5zZXJ0X2h5ZHJhdGlvbih0YXJnZXQsIG5vZGUsIGFuY2hvcik7XG59XG5mdW5jdGlvbiBkZXRhY2hfZGV2KG5vZGUpIHtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVJlbW92ZScsIHsgbm9kZSB9KTtcbiAgICBkZXRhY2gobm9kZSk7XG59XG5mdW5jdGlvbiBkZXRhY2hfYmV0d2Vlbl9kZXYoYmVmb3JlLCBhZnRlcikge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcgJiYgYmVmb3JlLm5leHRTaWJsaW5nICE9PSBhZnRlcikge1xuICAgICAgICBkZXRhY2hfZGV2KGJlZm9yZS5uZXh0U2libGluZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZGV0YWNoX2JlZm9yZV9kZXYoYWZ0ZXIpIHtcbiAgICB3aGlsZSAoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKSB7XG4gICAgICAgIGRldGFjaF9kZXYoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKTtcbiAgICB9XG59XG5mdW5jdGlvbiBkZXRhY2hfYWZ0ZXJfZGV2KGJlZm9yZSkge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgZGV0YWNoX2RldihiZWZvcmUubmV4dFNpYmxpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGxpc3Rlbl9kZXYobm9kZSwgZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMsIGhhc19wcmV2ZW50X2RlZmF1bHQsIGhhc19zdG9wX3Byb3BhZ2F0aW9uLCBoYXNfc3RvcF9pbW1lZGlhdGVfcHJvcGFnYXRpb24pIHtcbiAgICBjb25zdCBtb2RpZmllcnMgPSBvcHRpb25zID09PSB0cnVlID8gWydjYXB0dXJlJ10gOiBvcHRpb25zID8gQXJyYXkuZnJvbShPYmplY3Qua2V5cyhvcHRpb25zKSkgOiBbXTtcbiAgICBpZiAoaGFzX3ByZXZlbnRfZGVmYXVsdClcbiAgICAgICAgbW9kaWZpZXJzLnB1c2goJ3ByZXZlbnREZWZhdWx0Jyk7XG4gICAgaWYgKGhhc19zdG9wX3Byb3BhZ2F0aW9uKVxuICAgICAgICBtb2RpZmllcnMucHVzaCgnc3RvcFByb3BhZ2F0aW9uJyk7XG4gICAgaWYgKGhhc19zdG9wX2ltbWVkaWF0ZV9wcm9wYWdhdGlvbilcbiAgICAgICAgbW9kaWZpZXJzLnB1c2goJ3N0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbicpO1xuICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NQWRkRXZlbnRMaXN0ZW5lcicsIHsgbm9kZSwgZXZlbnQsIGhhbmRsZXIsIG1vZGlmaWVycyB9KTtcbiAgICBjb25zdCBkaXNwb3NlID0gbGlzdGVuKG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVJlbW92ZUV2ZW50TGlzdGVuZXInLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgICAgIGRpc3Bvc2UoKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gYXR0cl9kZXYobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgIGF0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSk7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NUmVtb3ZlQXR0cmlidXRlJywgeyBub2RlLCBhdHRyaWJ1dGUgfSk7XG4gICAgZWxzZVxuICAgICAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVNldEF0dHJpYnV0ZScsIHsgbm9kZSwgYXR0cmlidXRlLCB2YWx1ZSB9KTtcbn1cbmZ1bmN0aW9uIHByb3BfZGV2KG5vZGUsIHByb3BlcnR5LCB2YWx1ZSkge1xuICAgIG5vZGVbcHJvcGVydHldID0gdmFsdWU7XG4gICAgZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01TZXRQcm9wZXJ0eScsIHsgbm9kZSwgcHJvcGVydHksIHZhbHVlIH0pO1xufVxuZnVuY3Rpb24gZGF0YXNldF9kZXYobm9kZSwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgbm9kZS5kYXRhc2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NU2V0RGF0YXNldCcsIHsgbm9kZSwgcHJvcGVydHksIHZhbHVlIH0pO1xufVxuZnVuY3Rpb24gc2V0X2RhdGFfZGV2KHRleHQsIGRhdGEpIHtcbiAgICBkYXRhID0gJycgKyBkYXRhO1xuICAgIGlmICh0ZXh0LmRhdGEgPT09IGRhdGEpXG4gICAgICAgIHJldHVybjtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVNldERhdGEnLCB7IG5vZGU6IHRleHQsIGRhdGEgfSk7XG4gICAgdGV4dC5kYXRhID0gZGF0YTtcbn1cbmZ1bmN0aW9uIHNldF9kYXRhX2NvbnRlbnRlZGl0YWJsZV9kZXYodGV4dCwgZGF0YSkge1xuICAgIGRhdGEgPSAnJyArIGRhdGE7XG4gICAgaWYgKHRleHQud2hvbGVUZXh0ID09PSBkYXRhKVxuICAgICAgICByZXR1cm47XG4gICAgZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01TZXREYXRhJywgeyBub2RlOiB0ZXh0LCBkYXRhIH0pO1xuICAgIHRleHQuZGF0YSA9IGRhdGE7XG59XG5mdW5jdGlvbiBzZXRfZGF0YV9tYXliZV9jb250ZW50ZWRpdGFibGVfZGV2KHRleHQsIGRhdGEsIGF0dHJfdmFsdWUpIHtcbiAgICBpZiAofmNvbnRlbnRlZGl0YWJsZV90cnV0aHlfdmFsdWVzLmluZGV4T2YoYXR0cl92YWx1ZSkpIHtcbiAgICAgICAgc2V0X2RhdGFfY29udGVudGVkaXRhYmxlX2Rldih0ZXh0LCBkYXRhKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHNldF9kYXRhX2Rldih0ZXh0LCBkYXRhKTtcbiAgICB9XG59XG5mdW5jdGlvbiB2YWxpZGF0ZV9lYWNoX2FyZ3VtZW50KGFyZykge1xuICAgIGlmICh0eXBlb2YgYXJnICE9PSAnc3RyaW5nJyAmJiAhKGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiAnbGVuZ3RoJyBpbiBhcmcpKSB7XG4gICAgICAgIGxldCBtc2cgPSAneyNlYWNofSBvbmx5IGl0ZXJhdGVzIG92ZXIgYXJyYXktbGlrZSBvYmplY3RzLic7XG4gICAgICAgIGlmICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIGFyZyAmJiBTeW1ib2wuaXRlcmF0b3IgaW4gYXJnKSB7XG4gICAgICAgICAgICBtc2cgKz0gJyBZb3UgY2FuIHVzZSBhIHNwcmVhZCB0byBjb252ZXJ0IHRoaXMgaXRlcmFibGUgaW50byBhbiBhcnJheS4nO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHZhbGlkYXRlX3Nsb3RzKG5hbWUsIHNsb3QsIGtleXMpIHtcbiAgICBmb3IgKGNvbnN0IHNsb3Rfa2V5IG9mIE9iamVjdC5rZXlzKHNsb3QpKSB7XG4gICAgICAgIGlmICghfmtleXMuaW5kZXhPZihzbG90X2tleSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgPCR7bmFtZX0+IHJlY2VpdmVkIGFuIHVuZXhwZWN0ZWQgc2xvdCBcIiR7c2xvdF9rZXl9XCIuYCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiB2YWxpZGF0ZV9keW5hbWljX2VsZW1lbnQodGFnKSB7XG4gICAgY29uc3QgaXNfc3RyaW5nID0gdHlwZW9mIHRhZyA9PT0gJ3N0cmluZyc7XG4gICAgaWYgKHRhZyAmJiAhaXNfc3RyaW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignPHN2ZWx0ZTplbGVtZW50PiBleHBlY3RzIFwidGhpc1wiIGF0dHJpYnV0ZSB0byBiZSBhIHN0cmluZy4nKTtcbiAgICB9XG59XG5mdW5jdGlvbiB2YWxpZGF0ZV92b2lkX2R5bmFtaWNfZWxlbWVudCh0YWcpIHtcbiAgICBpZiAodGFnICYmIGlzX3ZvaWQodGFnKSkge1xuICAgICAgICBjb25zb2xlLndhcm4oYDxzdmVsdGU6ZWxlbWVudCB0aGlzPVwiJHt0YWd9XCI+IGlzIHNlbGYtY2xvc2luZyBhbmQgY2Fubm90IGhhdmUgY29udGVudC5gKTtcbiAgICB9XG59XG5mdW5jdGlvbiBjb25zdHJ1Y3Rfc3ZlbHRlX2NvbXBvbmVudF9kZXYoY29tcG9uZW50LCBwcm9wcykge1xuICAgIGNvbnN0IGVycm9yX21lc3NhZ2UgPSAndGhpcz17Li4ufSBvZiA8c3ZlbHRlOmNvbXBvbmVudD4gc2hvdWxkIHNwZWNpZnkgYSBTdmVsdGUgY29tcG9uZW50Lic7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgY29tcG9uZW50KHByb3BzKTtcbiAgICAgICAgaWYgKCFpbnN0YW5jZS4kJCB8fCAhaW5zdGFuY2UuJHNldCB8fCAhaW5zdGFuY2UuJG9uIHx8ICFpbnN0YW5jZS4kZGVzdHJveSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yX21lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zdCB7IG1lc3NhZ2UgfSA9IGVycjtcbiAgICAgICAgaWYgKHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJyAmJiBtZXNzYWdlLmluZGV4T2YoJ2lzIG5vdCBhIGNvbnN0cnVjdG9yJykgIT09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JfbWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG59XG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIFN2ZWx0ZSBjb21wb25lbnRzIHdpdGggc29tZSBtaW5vciBkZXYtZW5oYW5jZW1lbnRzLiBVc2VkIHdoZW4gZGV2PXRydWUuXG4gKi9cbmNsYXNzIFN2ZWx0ZUNvbXBvbmVudERldiBleHRlbmRzIFN2ZWx0ZUNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBpZiAoIW9wdGlvbnMgfHwgKCFvcHRpb25zLnRhcmdldCAmJiAhb3B0aW9ucy4kJGlubGluZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIid0YXJnZXQnIGlzIGEgcmVxdWlyZWQgb3B0aW9uXCIpO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgICRkZXN0cm95KCkge1xuICAgICAgICBzdXBlci4kZGVzdHJveSgpO1xuICAgICAgICB0aGlzLiRkZXN0cm95ID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdDb21wb25lbnQgd2FzIGFscmVhZHkgZGVzdHJveWVkJyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgICAgICB9O1xuICAgIH1cbiAgICAkY2FwdHVyZV9zdGF0ZSgpIHsgfVxuICAgICRpbmplY3Rfc3RhdGUoKSB7IH1cbn1cbi8qKlxuICogQmFzZSBjbGFzcyB0byBjcmVhdGUgc3Ryb25nbHkgdHlwZWQgU3ZlbHRlIGNvbXBvbmVudHMuXG4gKiBUaGlzIG9ubHkgZXhpc3RzIGZvciB0eXBpbmcgcHVycG9zZXMgYW5kIHNob3VsZCBiZSB1c2VkIGluIGAuZC50c2AgZmlsZXMuXG4gKlxuICogIyMjIEV4YW1wbGU6XG4gKlxuICogWW91IGhhdmUgY29tcG9uZW50IGxpYnJhcnkgb24gbnBtIGNhbGxlZCBgY29tcG9uZW50LWxpYnJhcnlgLCBmcm9tIHdoaWNoXG4gKiB5b3UgZXhwb3J0IGEgY29tcG9uZW50IGNhbGxlZCBgTXlDb21wb25lbnRgLiBGb3IgU3ZlbHRlK1R5cGVTY3JpcHQgdXNlcnMsXG4gKiB5b3Ugd2FudCB0byBwcm92aWRlIHR5cGluZ3MuIFRoZXJlZm9yZSB5b3UgY3JlYXRlIGEgYGluZGV4LmQudHNgOlxuICogYGBgdHNcbiAqIGltcG9ydCB7IFN2ZWx0ZUNvbXBvbmVudFR5cGVkIH0gZnJvbSBcInN2ZWx0ZVwiO1xuICogZXhwb3J0IGNsYXNzIE15Q29tcG9uZW50IGV4dGVuZHMgU3ZlbHRlQ29tcG9uZW50VHlwZWQ8e2Zvbzogc3RyaW5nfT4ge31cbiAqIGBgYFxuICogVHlwaW5nIHRoaXMgbWFrZXMgaXQgcG9zc2libGUgZm9yIElERXMgbGlrZSBWUyBDb2RlIHdpdGggdGhlIFN2ZWx0ZSBleHRlbnNpb25cbiAqIHRvIHByb3ZpZGUgaW50ZWxsaXNlbnNlIGFuZCB0byB1c2UgdGhlIGNvbXBvbmVudCBsaWtlIHRoaXMgaW4gYSBTdmVsdGUgZmlsZVxuICogd2l0aCBUeXBlU2NyaXB0OlxuICogYGBgc3ZlbHRlXG4gKiA8c2NyaXB0IGxhbmc9XCJ0c1wiPlxuICogXHRpbXBvcnQgeyBNeUNvbXBvbmVudCB9IGZyb20gXCJjb21wb25lbnQtbGlicmFyeVwiO1xuICogPC9zY3JpcHQ+XG4gKiA8TXlDb21wb25lbnQgZm9vPXsnYmFyJ30gLz5cbiAqIGBgYFxuICpcbiAqICMjIyMgV2h5IG5vdCBtYWtlIHRoaXMgcGFydCBvZiBgU3ZlbHRlQ29tcG9uZW50KERldilgP1xuICogQmVjYXVzZVxuICogYGBgdHNcbiAqIGNsYXNzIEFTdWJjbGFzc09mU3ZlbHRlQ29tcG9uZW50IGV4dGVuZHMgU3ZlbHRlQ29tcG9uZW50PHtmb286IHN0cmluZ30+IHt9XG4gKiBjb25zdCBjb21wb25lbnQ6IHR5cGVvZiBTdmVsdGVDb21wb25lbnQgPSBBU3ViY2xhc3NPZlN2ZWx0ZUNvbXBvbmVudDtcbiAqIGBgYFxuICogd2lsbCB0aHJvdyBhIHR5cGUgZXJyb3IsIHNvIHdlIG5lZWQgdG8gc2VwYXJhdGUgdGhlIG1vcmUgc3RyaWN0bHkgdHlwZWQgY2xhc3MuXG4gKi9cbmNsYXNzIFN2ZWx0ZUNvbXBvbmVudFR5cGVkIGV4dGVuZHMgU3ZlbHRlQ29tcG9uZW50RGV2IHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGxvb3BfZ3VhcmQodGltZW91dCkge1xuICAgIGNvbnN0IHN0YXJ0ID0gRGF0ZS5ub3coKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAoRGF0ZS5ub3coKSAtIHN0YXJ0ID4gdGltZW91dCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbmZpbml0ZSBsb29wIGRldGVjdGVkJyk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5leHBvcnQgeyBIdG1sVGFnLCBIdG1sVGFnSHlkcmF0aW9uLCBSZXNpemVPYnNlcnZlclNpbmdsZXRvbiwgU3ZlbHRlQ29tcG9uZW50LCBTdmVsdGVDb21wb25lbnREZXYsIFN2ZWx0ZUNvbXBvbmVudFR5cGVkLCBTdmVsdGVFbGVtZW50LCBhY3Rpb25fZGVzdHJveWVyLCBhZGRfYXR0cmlidXRlLCBhZGRfY2xhc3NlcywgYWRkX2ZsdXNoX2NhbGxiYWNrLCBhZGRfaWZyYW1lX3Jlc2l6ZV9saXN0ZW5lciwgYWRkX2xvY2F0aW9uLCBhZGRfcmVuZGVyX2NhbGxiYWNrLCBhZGRfc3R5bGVzLCBhZGRfdHJhbnNmb3JtLCBhZnRlclVwZGF0ZSwgYXBwZW5kLCBhcHBlbmRfZGV2LCBhcHBlbmRfZW1wdHlfc3R5bGVzaGVldCwgYXBwZW5kX2h5ZHJhdGlvbiwgYXBwZW5kX2h5ZHJhdGlvbl9kZXYsIGFwcGVuZF9zdHlsZXMsIGFzc2lnbiwgYXR0ciwgYXR0cl9kZXYsIGF0dHJpYnV0ZV90b19vYmplY3QsIGJlZm9yZVVwZGF0ZSwgYmluZCwgYmluZGluZ19jYWxsYmFja3MsIGJsYW5rX29iamVjdCwgYnViYmxlLCBjaGVja19vdXRyb3MsIGNoaWxkcmVuLCBjbGFpbV9jb21tZW50LCBjbGFpbV9jb21wb25lbnQsIGNsYWltX2VsZW1lbnQsIGNsYWltX2h0bWxfdGFnLCBjbGFpbV9zcGFjZSwgY2xhaW1fc3ZnX2VsZW1lbnQsIGNsYWltX3RleHQsIGNsZWFyX2xvb3BzLCBjb21tZW50LCBjb21wb25lbnRfc3Vic2NyaWJlLCBjb21wdXRlX3Jlc3RfcHJvcHMsIGNvbXB1dGVfc2xvdHMsIGNvbnN0cnVjdF9zdmVsdGVfY29tcG9uZW50LCBjb25zdHJ1Y3Rfc3ZlbHRlX2NvbXBvbmVudF9kZXYsIGNvbnRlbnRlZGl0YWJsZV90cnV0aHlfdmFsdWVzLCBjcmVhdGVFdmVudERpc3BhdGNoZXIsIGNyZWF0ZV9hbmltYXRpb24sIGNyZWF0ZV9iaWRpcmVjdGlvbmFsX3RyYW5zaXRpb24sIGNyZWF0ZV9jb21wb25lbnQsIGNyZWF0ZV9pbl90cmFuc2l0aW9uLCBjcmVhdGVfb3V0X3RyYW5zaXRpb24sIGNyZWF0ZV9zbG90LCBjcmVhdGVfc3NyX2NvbXBvbmVudCwgY3VycmVudF9jb21wb25lbnQsIGN1c3RvbV9ldmVudCwgZGF0YXNldF9kZXYsIGRlYnVnLCBkZXN0cm95X2Jsb2NrLCBkZXN0cm95X2NvbXBvbmVudCwgZGVzdHJveV9lYWNoLCBkZXRhY2gsIGRldGFjaF9hZnRlcl9kZXYsIGRldGFjaF9iZWZvcmVfZGV2LCBkZXRhY2hfYmV0d2Vlbl9kZXYsIGRldGFjaF9kZXYsIGRpcnR5X2NvbXBvbmVudHMsIGRpc3BhdGNoX2RldiwgZWFjaCwgZWxlbWVudCwgZWxlbWVudF9pcywgZW1wdHksIGVuZF9oeWRyYXRpbmcsIGVzY2FwZSwgZXNjYXBlX2F0dHJpYnV0ZV92YWx1ZSwgZXNjYXBlX29iamVjdCwgZXhjbHVkZV9pbnRlcm5hbF9wcm9wcywgZml4X2FuZF9kZXN0cm95X2Jsb2NrLCBmaXhfYW5kX291dHJvX2FuZF9kZXN0cm95X2Jsb2NrLCBmaXhfcG9zaXRpb24sIGZsdXNoLCBmbHVzaF9yZW5kZXJfY2FsbGJhY2tzLCBnZXRBbGxDb250ZXh0cywgZ2V0Q29udGV4dCwgZ2V0X2FsbF9kaXJ0eV9mcm9tX3Njb3BlLCBnZXRfYmluZGluZ19ncm91cF92YWx1ZSwgZ2V0X2N1cnJlbnRfY29tcG9uZW50LCBnZXRfY3VzdG9tX2VsZW1lbnRzX3Nsb3RzLCBnZXRfcm9vdF9mb3Jfc3R5bGUsIGdldF9zbG90X2NoYW5nZXMsIGdldF9zcHJlYWRfb2JqZWN0LCBnZXRfc3ByZWFkX3VwZGF0ZSwgZ2V0X3N0b3JlX3ZhbHVlLCBnbG9iYWxzLCBncm91cF9vdXRyb3MsIGhhbmRsZV9wcm9taXNlLCBoYXNDb250ZXh0LCBoYXNfcHJvcCwgaGVhZF9zZWxlY3RvciwgaWRlbnRpdHksIGluaXQsIGluaXRfYmluZGluZ19ncm91cCwgaW5pdF9iaW5kaW5nX2dyb3VwX2R5bmFtaWMsIGluc2VydCwgaW5zZXJ0X2RldiwgaW5zZXJ0X2h5ZHJhdGlvbiwgaW5zZXJ0X2h5ZHJhdGlvbl9kZXYsIGludHJvcywgaW52YWxpZF9hdHRyaWJ1dGVfbmFtZV9jaGFyYWN0ZXIsIGlzX2NsaWVudCwgaXNfY3Jvc3NvcmlnaW4sIGlzX2VtcHR5LCBpc19mdW5jdGlvbiwgaXNfcHJvbWlzZSwgaXNfdm9pZCwgbGlzdGVuLCBsaXN0ZW5fZGV2LCBsb29wLCBsb29wX2d1YXJkLCBtZXJnZV9zc3Jfc3R5bGVzLCBtaXNzaW5nX2NvbXBvbmVudCwgbW91bnRfY29tcG9uZW50LCBub29wLCBub3RfZXF1YWwsIG5vdywgbnVsbF90b19lbXB0eSwgb2JqZWN0X3dpdGhvdXRfcHJvcGVydGllcywgb25EZXN0cm95LCBvbk1vdW50LCBvbmNlLCBvdXRyb19hbmRfZGVzdHJveV9ibG9jaywgcHJldmVudF9kZWZhdWx0LCBwcm9wX2RldiwgcXVlcnlfc2VsZWN0b3JfYWxsLCByYWYsIHJlc2l6ZV9vYnNlcnZlcl9ib3JkZXJfYm94LCByZXNpemVfb2JzZXJ2ZXJfY29udGVudF9ib3gsIHJlc2l6ZV9vYnNlcnZlcl9kZXZpY2VfcGl4ZWxfY29udGVudF9ib3gsIHJ1biwgcnVuX2FsbCwgc2FmZV9ub3RfZXF1YWwsIHNjaGVkdWxlX3VwZGF0ZSwgc2VsZWN0X211bHRpcGxlX3ZhbHVlLCBzZWxlY3Rfb3B0aW9uLCBzZWxlY3Rfb3B0aW9ucywgc2VsZWN0X3ZhbHVlLCBzZWxmLCBzZXRDb250ZXh0LCBzZXRfYXR0cmlidXRlcywgc2V0X2N1cnJlbnRfY29tcG9uZW50LCBzZXRfY3VzdG9tX2VsZW1lbnRfZGF0YSwgc2V0X2N1c3RvbV9lbGVtZW50X2RhdGFfbWFwLCBzZXRfZGF0YSwgc2V0X2RhdGFfY29udGVudGVkaXRhYmxlLCBzZXRfZGF0YV9jb250ZW50ZWRpdGFibGVfZGV2LCBzZXRfZGF0YV9kZXYsIHNldF9kYXRhX21heWJlX2NvbnRlbnRlZGl0YWJsZSwgc2V0X2RhdGFfbWF5YmVfY29udGVudGVkaXRhYmxlX2Rldiwgc2V0X2R5bmFtaWNfZWxlbWVudF9kYXRhLCBzZXRfaW5wdXRfdHlwZSwgc2V0X2lucHV0X3ZhbHVlLCBzZXRfbm93LCBzZXRfcmFmLCBzZXRfc3RvcmVfdmFsdWUsIHNldF9zdHlsZSwgc2V0X3N2Z19hdHRyaWJ1dGVzLCBzcGFjZSwgc3BsaXRfY3NzX3VuaXQsIHNwcmVhZCwgc3JjX3VybF9lcXVhbCwgc3RhcnRfaHlkcmF0aW5nLCBzdG9wX2ltbWVkaWF0ZV9wcm9wYWdhdGlvbiwgc3RvcF9wcm9wYWdhdGlvbiwgc3Vic2NyaWJlLCBzdmdfZWxlbWVudCwgdGV4dCwgdGljaywgdGltZV9yYW5nZXNfdG9fYXJyYXksIHRvX251bWJlciwgdG9nZ2xlX2NsYXNzLCB0cmFuc2l0aW9uX2luLCB0cmFuc2l0aW9uX291dCwgdHJ1c3RlZCwgdXBkYXRlX2F3YWl0X2Jsb2NrX2JyYW5jaCwgdXBkYXRlX2tleWVkX2VhY2gsIHVwZGF0ZV9zbG90LCB1cGRhdGVfc2xvdF9iYXNlLCB2YWxpZGF0ZV9jb21wb25lbnQsIHZhbGlkYXRlX2R5bmFtaWNfZWxlbWVudCwgdmFsaWRhdGVfZWFjaF9hcmd1bWVudCwgdmFsaWRhdGVfZWFjaF9rZXlzLCB2YWxpZGF0ZV9zbG90cywgdmFsaWRhdGVfc3RvcmUsIHZhbGlkYXRlX3ZvaWRfZHluYW1pY19lbGVtZW50LCB4bGlua19hdHRyIH07XG4iLCI8c2NyaXB0IGxhbmc9XCJ0c1wiPlxuICBpbXBvcnQgeyBjcmVhdGVFdmVudERpc3BhdGNoZXIgfSBmcm9tICdzdmVsdGUnO1xuICBcbiAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKTtcbiAgXG4gIGxldCBjdXJyZW50U3RlcCA9IDE7XG4gIGxldCB0b2tlbiA9ICcnO1xuICBsZXQgc2hvd1Rva2VuID0gZmFsc2U7XG4gIFxuICBmdW5jdGlvbiBnZW5lcmF0ZVRva2VuKCkge1xuICAgIC8vIFdlJ2xsIG9wZW4gdGhlIE5ldGxpZnkgdG9rZW4gZ2VuZXJhdGlvbiBwYWdlIGluIGEgbmV3IHRhYlxuICAgIHdpbmRvdy5vcGVuKCdodHRwczovL2FwcC5uZXRsaWZ5LmNvbS91c2VyL2FwcGxpY2F0aW9ucyNwZXJzb25hbC1hY2Nlc3MtdG9rZW5zJywgJ19ibGFuaycpO1xuICAgIGN1cnJlbnRTdGVwID0gMjtcbiAgfVxuICBcbiAgZnVuY3Rpb24gc3VibWl0VG9rZW4oKSB7XG4gICAgaWYgKHRva2VuKSB7XG4gICAgICBkaXNwYXRjaCgndG9rZW5HZW5lcmF0ZWQnLCB7IHRva2VuIH0pO1xuICAgIH1cbiAgfVxuPC9zY3JpcHQ+XG5cbjxkaXYgY2xhc3M9XCJhdXRoLWZsb3dcIj5cbiAgPGRpdiBjbGFzcz1cInN0ZXAtY29udGFpbmVyXCI+XG4gICAgPGRpdiBjbGFzcz1cInN0ZXAtaW5kaWNhdG9yc1wiPlxuICAgICAgPGRpdiBjbGFzcz1cInN0ZXAtaW5kaWNhdG9yIHtjdXJyZW50U3RlcCA+PSAxID8gJ2FjdGl2ZScgOiAnJ31cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInN0ZXAtbnVtYmVyXCI+MTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwic3RlcC1sYWJlbFwiPkdlbmVyYXRlIFRva2VuPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzdGVwLWNvbm5lY3RvclwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInN0ZXAtaW5kaWNhdG9yIHtjdXJyZW50U3RlcCA+PSAyID8gJ2FjdGl2ZScgOiAnJ31cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInN0ZXAtbnVtYmVyXCI+MjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwic3RlcC1sYWJlbFwiPkNvcHkgVG9rZW48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInN0ZXAtY29ubmVjdG9yXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic3RlcC1pbmRpY2F0b3Ige2N1cnJlbnRTdGVwID49IDMgPyAnYWN0aXZlJyA6ICcnfVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwic3RlcC1udW1iZXJcIj4zPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzdGVwLWxhYmVsXCI+QXV0aGVudGljYXRlPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIFxuICA8ZGl2IGNsYXNzPVwic3RlcC1jb250ZW50XCI+XG4gICAgeyNpZiBjdXJyZW50U3RlcCA9PT0gMX1cbiAgICAgIDxkaXYgY2xhc3M9XCJzdGVwLWluZm9cIj5cbiAgICAgICAgPGgzPkdlbmVyYXRlIGEgTmV0bGlmeSBQZXJzb25hbCBBY2Nlc3MgVG9rZW48L2gzPlxuICAgICAgICA8cD5cbiAgICAgICAgICBUbyBkZXBsb3kgeW91ciBzbGlkZXMgdG8gTmV0bGlmeSwgeW91IG5lZWQgdG8gZ2VuZXJhdGUgYSBwZXJzb25hbCBhY2Nlc3MgdG9rZW4uXG4gICAgICAgICAgVGhpcyB3aWxsIGFsbG93IHRoZSBwbHVnaW4gdG8gc2VjdXJlbHkgZGVwbG95IG9uIHlvdXIgYmVoYWxmLlxuICAgICAgICA8L3A+XG4gICAgICAgIDxvbCBjbGFzcz1cImluc3RydWN0aW9uc1wiPlxuICAgICAgICAgIDxsaT5DbGljayB0aGUgYnV0dG9uIGJlbG93IHRvIG9wZW4gdGhlIE5ldGxpZnkgYWNjZXNzIHRva2VucyBwYWdlPC9saT5cbiAgICAgICAgICA8bGk+TG9nIGluIHRvIHlvdXIgTmV0bGlmeSBhY2NvdW50IGlmIHByb21wdGVkPC9saT5cbiAgICAgICAgICA8bGk+Q2xpY2sgXCJOZXcgYWNjZXNzIHRva2VuXCI8L2xpPlxuICAgICAgICAgIDxsaT5HaXZlIGl0IGEgZGVzY3JpcHRpb24gKGUuZy4sIFwiT2JzaWRpYW4gQWR2YW5jZWQgU2xpZGVzIERlcGxveVwiKTwvbGk+XG4gICAgICAgICAgPGxpPlNlbGVjdCB0aGUgc2NvcGU6IFwic2l0ZXM6cmVhZFwiLCBcInNpdGVzOndyaXRlXCIsIFwiZGVwbG95bWVudHM6d3JpdGVcIjwvbGk+XG4gICAgICAgICAgPGxpPkNsaWNrIFwiR2VuZXJhdGUgdG9rZW5cIjwvbGk+XG4gICAgICAgIDwvb2w+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJhY3Rpb24tYnV0dG9uXCIgb246Y2xpY2s9e2dlbmVyYXRlVG9rZW59PlxuICAgICAgICAgIE9wZW4gTmV0bGlmeSBUb2tlbiBQYWdlXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgezplbHNlIGlmIGN1cnJlbnRTdGVwID09PSAyfVxuICAgICAgPGRpdiBjbGFzcz1cInN0ZXAtaW5mb1wiPlxuICAgICAgICA8aDM+Q29weSBZb3VyIE5ldyBBY2Nlc3MgVG9rZW48L2gzPlxuICAgICAgICA8cD5cbiAgICAgICAgICBPbmNlIHlvdSd2ZSBnZW5lcmF0ZWQgeW91ciB0b2tlbiBpbiBOZXRsaWZ5LCBjb3B5IGl0IHRvIHlvdXIgY2xpcGJvYXJkIGFuZCBwYXN0ZSBpdCBiZWxvdy5cbiAgICAgICAgICA8c3Ryb25nPkltcG9ydGFudDo8L3N0cm9uZz4gTmV0bGlmeSB3aWxsIG9ubHkgc2hvdyB0aGUgdG9rZW4gb25jZSwgc28gbWFrZSBzdXJlIHRvIGNvcHkgaXQgYmVmb3JlIGNsb3NpbmcgdGhlIHBhZ2UhXG4gICAgICAgIDwvcD5cbiAgICAgICAgPGRpdiBjbGFzcz1cInRva2VuLWlucHV0XCI+XG4gICAgICAgICAgeyNpZiBzaG93VG9rZW59XG4gICAgICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCIgXG4gICAgICAgICAgICAgIGJpbmQ6dmFsdWU9e3Rva2VufSBcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJQYXN0ZSB5b3VyIE5ldGxpZnkgdG9rZW4gaGVyZVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIHs6ZWxzZX1cbiAgICAgICAgICAgIDxpbnB1dCBcbiAgICAgICAgICAgICAgdHlwZT1cInBhc3N3b3JkXCIgXG4gICAgICAgICAgICAgIGJpbmQ6dmFsdWU9e3Rva2VufSBcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJQYXN0ZSB5b3VyIE5ldGxpZnkgdG9rZW4gaGVyZVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIHsvaWZ9XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInRvZ2dsZS1idXR0b25cIiBvbjpjbGljaz17KCkgPT4gc2hvd1Rva2VuID0gIXNob3dUb2tlbn0+XG4gICAgICAgICAgICB7c2hvd1Rva2VuID8gJ0hpZGUnIDogJ1Nob3cnfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1yb3dcIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYmFjay1idXR0b25cIiBvbjpjbGljaz17KCkgPT4gY3VycmVudFN0ZXAgPSAxfT5cbiAgICAgICAgICAgIEJhY2tcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgY2xhc3M9XCJhY3Rpb24tYnV0dG9uXCIgXG4gICAgICAgICAgICBvbjpjbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBpZiAodG9rZW4pIGN1cnJlbnRTdGVwID0gMztcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBkaXNhYmxlZD17IXRva2VufVxuICAgICAgICAgID5cbiAgICAgICAgICAgIENvbnRpbnVlXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgezplbHNlIGlmIGN1cnJlbnRTdGVwID09PSAzfVxuICAgICAgPGRpdiBjbGFzcz1cInN0ZXAtaW5mb1wiPlxuICAgICAgICA8aDM+Q29tcGxldGUgQXV0aGVudGljYXRpb248L2gzPlxuICAgICAgICA8cD5cbiAgICAgICAgICBZb3UncmUgYWxsIHNldCEgQ2xpY2sgdGhlIGJ1dHRvbiBiZWxvdyB0byBjb21wbGV0ZSB0aGUgYXV0aGVudGljYXRpb24gcHJvY2VzcyBhbmQgc2F2ZSB5b3VyIHRva2VuIHNlY3VyZWx5IGluIE9ic2lkaWFuLlxuICAgICAgICA8L3A+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0b2tlbi1wcmV2aWV3XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInRva2VuLW1hc2tcIj57c2hvd1Rva2VuID8gdG9rZW4gOiB0b2tlbi5yZXBsYWNlKC8uL2csICfigKInKX08L2Rpdj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwidG9nZ2xlLWJ1dHRvblwiIG9uOmNsaWNrPXsoKSA9PiBzaG93VG9rZW4gPSAhc2hvd1Rva2VufT5cbiAgICAgICAgICAgIHtzaG93VG9rZW4gPyAnSGlkZScgOiAnU2hvdyd9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLXJvd1wiPlxuICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJiYWNrLWJ1dHRvblwiIG9uOmNsaWNrPXsoKSA9PiBjdXJyZW50U3RlcCA9IDJ9PlxuICAgICAgICAgICAgQmFja1xuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJhY3Rpb24tYnV0dG9uXCIgb246Y2xpY2s9e3N1Ym1pdFRva2VufT5cbiAgICAgICAgICAgIENvbXBsZXRlIEF1dGhlbnRpY2F0aW9uXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgey9pZn1cbiAgPC9kaXY+XG48L2Rpdj5cblxuPHN0eWxlPlxuICAuYXV0aC1mbG93IHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBtYXgtd2lkdGg6IDYwMHB4O1xuICAgIG1hcmdpbjogMCBhdXRvO1xuICB9XG4gIFxuICAuc3RlcC1jb250YWluZXIge1xuICAgIG1hcmdpbi1ib3R0b206IDJyZW07XG4gIH1cbiAgXG4gIC5zdGVwLWluZGljYXRvcnMge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgcGFkZGluZzogMCAxcmVtO1xuICB9XG4gIFxuICAuc3RlcC1pbmRpY2F0b3Ige1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIG9wYWNpdHk6IDAuNTtcbiAgfVxuICBcbiAgLnN0ZXAtaW5kaWNhdG9yLmFjdGl2ZSB7XG4gICAgb3BhY2l0eTogMTtcbiAgfVxuICBcbiAgLnN0ZXAtbnVtYmVyIHtcbiAgICB3aWR0aDogMnJlbTtcbiAgICBoZWlnaHQ6IDJyZW07XG4gICAgYmFja2dyb3VuZDogdmFyKC0tYmFja2dyb3VuZC1zZWNvbmRhcnktYWx0KTtcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIG1hcmdpbi1ib3R0b206IDAuNXJlbTtcbiAgICBmb250LXdlaWdodDogYm9sZDtcbiAgfVxuICBcbiAgLnN0ZXAtaW5kaWNhdG9yLmFjdGl2ZSAuc3RlcC1udW1iZXIge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWludGVyYWN0aXZlLWFjY2VudCk7XG4gICAgY29sb3I6IHZhcigtLXRleHQtb24tYWNjZW50KTtcbiAgfVxuICBcbiAgLnN0ZXAtY29ubmVjdG9yIHtcbiAgICBoZWlnaHQ6IDJweDtcbiAgICBmbGV4LWdyb3c6IDE7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tYmFja2dyb3VuZC1zZWNvbmRhcnktYWx0KTtcbiAgICBtYXJnaW46IDAgMC41cmVtO1xuICAgIG1hcmdpbi1ib3R0b206IDJyZW07XG4gIH1cbiAgXG4gIC5zdGVwLWNvbnRlbnQge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWJhY2tncm91bmQtc2Vjb25kYXJ5KTtcbiAgICBwYWRkaW5nOiAxLjVyZW07XG4gICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICB9XG4gIFxuICAuc3RlcC1pbmZvIGgzIHtcbiAgICBtYXJnaW4tdG9wOiAwO1xuICAgIG1hcmdpbi1ib3R0b206IDFyZW07XG4gIH1cbiAgXG4gIC5pbnN0cnVjdGlvbnMge1xuICAgIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcbiAgICBwYWRkaW5nLWxlZnQ6IDEuMnJlbTtcbiAgfVxuICBcbiAgLmluc3RydWN0aW9ucyBsaSB7XG4gICAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xuICB9XG4gIFxuICAudG9rZW4taW5wdXQge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgbWFyZ2luLWJvdHRvbTogMS41cmVtO1xuICAgIG1hcmdpbi10b3A6IDFyZW07XG4gIH1cbiAgXG4gIGlucHV0W3R5cGU9XCJ0ZXh0XCJdLFxuICBpbnB1dFt0eXBlPVwicGFzc3dvcmRcIl0ge1xuICAgIGZsZXgtZ3JvdzogMTtcbiAgICBwYWRkaW5nOiAwLjVyZW07XG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tYmFja2dyb3VuZC1tb2RpZmllci1ib3JkZXIpO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweCAwIDAgNHB4O1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWJhY2tncm91bmQtcHJpbWFyeSk7XG4gIH1cbiAgXG4gIC50b2dnbGUtYnV0dG9uIHtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1iYWNrZ3JvdW5kLW1vZGlmaWVyLWJvcmRlcik7XG4gICAgYm9yZGVyLWxlZnQ6IG5vbmU7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tYmFja2dyb3VuZC1zZWNvbmRhcnktYWx0KTtcbiAgICBib3JkZXItcmFkaXVzOiAwIDRweCA0cHggMDtcbiAgICBwYWRkaW5nOiAwIDAuNzVyZW07XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG4gIFxuICAuYWN0aW9uLWJ1dHRvbiB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0taW50ZXJhY3RpdmUtYWNjZW50KTtcbiAgICBjb2xvcjogdmFyKC0tdGV4dC1vbi1hY2NlbnQpO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgcGFkZGluZzogMC41cmVtIDFyZW07XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG4gIFxuICAuYWN0aW9uLWJ1dHRvbjpkaXNhYmxlZCB7XG4gICAgb3BhY2l0eTogMC41O1xuICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gIH1cbiAgXG4gIC5iYWNrLWJ1dHRvbiB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tYmFja2dyb3VuZC1tb2RpZmllci1ib3JkZXIpO1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LW5vcm1hbCk7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICBwYWRkaW5nOiAwLjVyZW0gMXJlbTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIH1cbiAgXG4gIC5idXR0b24tcm93IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgfVxuICBcbiAgLnRva2VuLXByZXZpZXcge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWJhY2tncm91bmQtcHJpbWFyeSk7XG4gICAgcGFkZGluZzogMC41cmVtO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgfVxuICBcbiAgLnRva2VuLW1hc2sge1xuICAgIGZvbnQtZmFtaWx5OiBtb25vc3BhY2U7XG4gICAgb3ZlcmZsb3cteDogYXV0bztcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgIG1heC13aWR0aDogODAlO1xuICB9XG48L3N0eWxlPiIsIi8qIVxuXG5KU1ppcCB2My4xMC4xIC0gQSBKYXZhU2NyaXB0IGNsYXNzIGZvciBnZW5lcmF0aW5nIGFuZCByZWFkaW5nIHppcCBmaWxlc1xuPGh0dHA6Ly9zdHVhcnRrLmNvbS9qc3ppcD5cblxuKGMpIDIwMDktMjAxNiBTdHVhcnQgS25pZ2h0bGV5IDxzdHVhcnQgW2F0XSBzdHVhcnRrLmNvbT5cbkR1YWwgbGljZW5jZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIG9yIEdQTHYzLiBTZWUgaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9TdHVrL2pzemlwL21haW4vTElDRU5TRS5tYXJrZG93bi5cblxuSlNaaXAgdXNlcyB0aGUgbGlicmFyeSBwYWtvIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSA6XG5odHRwczovL2dpdGh1Yi5jb20vbm9kZWNhL3Bha28vYmxvYi9tYWluL0xJQ0VOU0VcbiovXG5cbiFmdW5jdGlvbihlKXtpZihcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSltb2R1bGUuZXhwb3J0cz1lKCk7ZWxzZSBpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQpZGVmaW5lKFtdLGUpO2Vsc2V7KFwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmP3NlbGY6dGhpcykuSlNaaXA9ZSgpfX0oZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24gcyhhLG8saCl7ZnVuY3Rpb24gdShyLGUpe2lmKCFvW3JdKXtpZighYVtyXSl7dmFyIHQ9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZSYmdClyZXR1cm4gdChyLCEwKTtpZihsKXJldHVybiBsKHIsITApO3ZhciBuPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrcitcIidcIik7dGhyb3cgbi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLG59dmFyIGk9b1tyXT17ZXhwb3J0czp7fX07YVtyXVswXS5jYWxsKGkuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgdD1hW3JdWzFdW2VdO3JldHVybiB1KHR8fGUpfSxpLGkuZXhwb3J0cyxzLGEsbyxoKX1yZXR1cm4gb1tyXS5leHBvcnRzfWZvcih2YXIgbD1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGU9MDtlPGgubGVuZ3RoO2UrKyl1KGhbZV0pO3JldHVybiB1fSh7MTpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBkPWUoXCIuL3V0aWxzXCIpLGM9ZShcIi4vc3VwcG9ydFwiKSxwPVwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz1cIjtyLmVuY29kZT1mdW5jdGlvbihlKXtmb3IodmFyIHQscixuLGkscyxhLG8saD1bXSx1PTAsbD1lLmxlbmd0aCxmPWwsYz1cInN0cmluZ1wiIT09ZC5nZXRUeXBlT2YoZSk7dTxlLmxlbmd0aDspZj1sLXUsbj1jPyh0PWVbdSsrXSxyPXU8bD9lW3UrK106MCx1PGw/ZVt1KytdOjApOih0PWUuY2hhckNvZGVBdCh1KyspLHI9dTxsP2UuY2hhckNvZGVBdCh1KyspOjAsdTxsP2UuY2hhckNvZGVBdCh1KyspOjApLGk9dD4+MixzPSgzJnQpPDw0fHI+PjQsYT0xPGY/KDE1JnIpPDwyfG4+PjY6NjQsbz0yPGY/NjMmbjo2NCxoLnB1c2gocC5jaGFyQXQoaSkrcC5jaGFyQXQocykrcC5jaGFyQXQoYSkrcC5jaGFyQXQobykpO3JldHVybiBoLmpvaW4oXCJcIil9LHIuZGVjb2RlPWZ1bmN0aW9uKGUpe3ZhciB0LHIsbixpLHMsYSxvPTAsaD0wLHU9XCJkYXRhOlwiO2lmKGUuc3Vic3RyKDAsdS5sZW5ndGgpPT09dSl0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGJhc2U2NCBpbnB1dCwgaXQgbG9va3MgbGlrZSBhIGRhdGEgdXJsLlwiKTt2YXIgbCxmPTMqKGU9ZS5yZXBsYWNlKC9bXkEtWmEtejAtOSsvPV0vZyxcIlwiKSkubGVuZ3RoLzQ7aWYoZS5jaGFyQXQoZS5sZW5ndGgtMSk9PT1wLmNoYXJBdCg2NCkmJmYtLSxlLmNoYXJBdChlLmxlbmd0aC0yKT09PXAuY2hhckF0KDY0KSYmZi0tLGYlMSE9MCl0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGJhc2U2NCBpbnB1dCwgYmFkIGNvbnRlbnQgbGVuZ3RoLlwiKTtmb3IobD1jLnVpbnQ4YXJyYXk/bmV3IFVpbnQ4QXJyYXkoMHxmKTpuZXcgQXJyYXkoMHxmKTtvPGUubGVuZ3RoOyl0PXAuaW5kZXhPZihlLmNoYXJBdChvKyspKTw8MnwoaT1wLmluZGV4T2YoZS5jaGFyQXQobysrKSkpPj40LHI9KDE1JmkpPDw0fChzPXAuaW5kZXhPZihlLmNoYXJBdChvKyspKSk+PjIsbj0oMyZzKTw8NnwoYT1wLmluZGV4T2YoZS5jaGFyQXQobysrKSkpLGxbaCsrXT10LDY0IT09cyYmKGxbaCsrXT1yKSw2NCE9PWEmJihsW2grK109bik7cmV0dXJuIGx9fSx7XCIuL3N1cHBvcnRcIjozMCxcIi4vdXRpbHNcIjozMn1dLDI6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1lKFwiLi9leHRlcm5hbFwiKSxpPWUoXCIuL3N0cmVhbS9EYXRhV29ya2VyXCIpLHM9ZShcIi4vc3RyZWFtL0NyYzMyUHJvYmVcIiksYT1lKFwiLi9zdHJlYW0vRGF0YUxlbmd0aFByb2JlXCIpO2Z1bmN0aW9uIG8oZSx0LHIsbixpKXt0aGlzLmNvbXByZXNzZWRTaXplPWUsdGhpcy51bmNvbXByZXNzZWRTaXplPXQsdGhpcy5jcmMzMj1yLHRoaXMuY29tcHJlc3Npb249bix0aGlzLmNvbXByZXNzZWRDb250ZW50PWl9by5wcm90b3R5cGU9e2dldENvbnRlbnRXb3JrZXI6ZnVuY3Rpb24oKXt2YXIgZT1uZXcgaShuLlByb21pc2UucmVzb2x2ZSh0aGlzLmNvbXByZXNzZWRDb250ZW50KSkucGlwZSh0aGlzLmNvbXByZXNzaW9uLnVuY29tcHJlc3NXb3JrZXIoKSkucGlwZShuZXcgYShcImRhdGFfbGVuZ3RoXCIpKSx0PXRoaXM7cmV0dXJuIGUub24oXCJlbmRcIixmdW5jdGlvbigpe2lmKHRoaXMuc3RyZWFtSW5mby5kYXRhX2xlbmd0aCE9PXQudW5jb21wcmVzc2VkU2l6ZSl0aHJvdyBuZXcgRXJyb3IoXCJCdWcgOiB1bmNvbXByZXNzZWQgZGF0YSBzaXplIG1pc21hdGNoXCIpfSksZX0sZ2V0Q29tcHJlc3NlZFdvcmtlcjpmdW5jdGlvbigpe3JldHVybiBuZXcgaShuLlByb21pc2UucmVzb2x2ZSh0aGlzLmNvbXByZXNzZWRDb250ZW50KSkud2l0aFN0cmVhbUluZm8oXCJjb21wcmVzc2VkU2l6ZVwiLHRoaXMuY29tcHJlc3NlZFNpemUpLndpdGhTdHJlYW1JbmZvKFwidW5jb21wcmVzc2VkU2l6ZVwiLHRoaXMudW5jb21wcmVzc2VkU2l6ZSkud2l0aFN0cmVhbUluZm8oXCJjcmMzMlwiLHRoaXMuY3JjMzIpLndpdGhTdHJlYW1JbmZvKFwiY29tcHJlc3Npb25cIix0aGlzLmNvbXByZXNzaW9uKX19LG8uY3JlYXRlV29ya2VyRnJvbT1mdW5jdGlvbihlLHQscil7cmV0dXJuIGUucGlwZShuZXcgcykucGlwZShuZXcgYShcInVuY29tcHJlc3NlZFNpemVcIikpLnBpcGUodC5jb21wcmVzc1dvcmtlcihyKSkucGlwZShuZXcgYShcImNvbXByZXNzZWRTaXplXCIpKS53aXRoU3RyZWFtSW5mbyhcImNvbXByZXNzaW9uXCIsdCl9LHQuZXhwb3J0cz1vfSx7XCIuL2V4dGVybmFsXCI6NixcIi4vc3RyZWFtL0NyYzMyUHJvYmVcIjoyNSxcIi4vc3RyZWFtL0RhdGFMZW5ndGhQcm9iZVwiOjI2LFwiLi9zdHJlYW0vRGF0YVdvcmtlclwiOjI3fV0sMzpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPWUoXCIuL3N0cmVhbS9HZW5lcmljV29ya2VyXCIpO3IuU1RPUkU9e21hZ2ljOlwiXFwwXFwwXCIsY29tcHJlc3NXb3JrZXI6ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IG4oXCJTVE9SRSBjb21wcmVzc2lvblwiKX0sdW5jb21wcmVzc1dvcmtlcjpmdW5jdGlvbigpe3JldHVybiBuZXcgbihcIlNUT1JFIGRlY29tcHJlc3Npb25cIil9fSxyLkRFRkxBVEU9ZShcIi4vZmxhdGVcIil9LHtcIi4vZmxhdGVcIjo3LFwiLi9zdHJlYW0vR2VuZXJpY1dvcmtlclwiOjI4fV0sNDpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPWUoXCIuL3V0aWxzXCIpO3ZhciBvPWZ1bmN0aW9uKCl7Zm9yKHZhciBlLHQ9W10scj0wO3I8MjU2O3IrKyl7ZT1yO2Zvcih2YXIgbj0wO248ODtuKyspZT0xJmU/Mzk4ODI5MjM4NF5lPj4+MTplPj4+MTt0W3JdPWV9cmV0dXJuIHR9KCk7dC5leHBvcnRzPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHZvaWQgMCE9PWUmJmUubGVuZ3RoP1wic3RyaW5nXCIhPT1uLmdldFR5cGVPZihlKT9mdW5jdGlvbihlLHQscixuKXt2YXIgaT1vLHM9bityO2VePS0xO2Zvcih2YXIgYT1uO2E8czthKyspZT1lPj4+OF5pWzI1NSYoZV50W2FdKV07cmV0dXJuLTFeZX0oMHx0LGUsZS5sZW5ndGgsMCk6ZnVuY3Rpb24oZSx0LHIsbil7dmFyIGk9byxzPW4rcjtlXj0tMTtmb3IodmFyIGE9bjthPHM7YSsrKWU9ZT4+PjheaVsyNTUmKGVedC5jaGFyQ29kZUF0KGEpKV07cmV0dXJuLTFeZX0oMHx0LGUsZS5sZW5ndGgsMCk6MH19LHtcIi4vdXRpbHNcIjozMn1dLDU6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjtyLmJhc2U2ND0hMSxyLmJpbmFyeT0hMSxyLmRpcj0hMSxyLmNyZWF0ZUZvbGRlcnM9ITAsci5kYXRlPW51bGwsci5jb21wcmVzc2lvbj1udWxsLHIuY29tcHJlc3Npb25PcHRpb25zPW51bGwsci5jb21tZW50PW51bGwsci51bml4UGVybWlzc2lvbnM9bnVsbCxyLmRvc1Blcm1pc3Npb25zPW51bGx9LHt9XSw2OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49bnVsbDtuPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBQcm9taXNlP1Byb21pc2U6ZShcImxpZVwiKSx0LmV4cG9ydHM9e1Byb21pc2U6bn19LHtsaWU6Mzd9XSw3OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFVpbnQ4QXJyYXkmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBVaW50MTZBcnJheSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIFVpbnQzMkFycmF5LGk9ZShcInBha29cIikscz1lKFwiLi91dGlsc1wiKSxhPWUoXCIuL3N0cmVhbS9HZW5lcmljV29ya2VyXCIpLG89bj9cInVpbnQ4YXJyYXlcIjpcImFycmF5XCI7ZnVuY3Rpb24gaChlLHQpe2EuY2FsbCh0aGlzLFwiRmxhdGVXb3JrZXIvXCIrZSksdGhpcy5fcGFrbz1udWxsLHRoaXMuX3Bha29BY3Rpb249ZSx0aGlzLl9wYWtvT3B0aW9ucz10LHRoaXMubWV0YT17fX1yLm1hZ2ljPVwiXFxiXFwwXCIscy5pbmhlcml0cyhoLGEpLGgucHJvdG90eXBlLnByb2Nlc3NDaHVuaz1mdW5jdGlvbihlKXt0aGlzLm1ldGE9ZS5tZXRhLG51bGw9PT10aGlzLl9wYWtvJiZ0aGlzLl9jcmVhdGVQYWtvKCksdGhpcy5fcGFrby5wdXNoKHMudHJhbnNmb3JtVG8obyxlLmRhdGEpLCExKX0saC5wcm90b3R5cGUuZmx1c2g9ZnVuY3Rpb24oKXthLnByb3RvdHlwZS5mbHVzaC5jYWxsKHRoaXMpLG51bGw9PT10aGlzLl9wYWtvJiZ0aGlzLl9jcmVhdGVQYWtvKCksdGhpcy5fcGFrby5wdXNoKFtdLCEwKX0saC5wcm90b3R5cGUuY2xlYW5VcD1mdW5jdGlvbigpe2EucHJvdG90eXBlLmNsZWFuVXAuY2FsbCh0aGlzKSx0aGlzLl9wYWtvPW51bGx9LGgucHJvdG90eXBlLl9jcmVhdGVQYWtvPWZ1bmN0aW9uKCl7dGhpcy5fcGFrbz1uZXcgaVt0aGlzLl9wYWtvQWN0aW9uXSh7cmF3OiEwLGxldmVsOnRoaXMuX3Bha29PcHRpb25zLmxldmVsfHwtMX0pO3ZhciB0PXRoaXM7dGhpcy5fcGFrby5vbkRhdGE9ZnVuY3Rpb24oZSl7dC5wdXNoKHtkYXRhOmUsbWV0YTp0Lm1ldGF9KX19LHIuY29tcHJlc3NXb3JrZXI9ZnVuY3Rpb24oZSl7cmV0dXJuIG5ldyBoKFwiRGVmbGF0ZVwiLGUpfSxyLnVuY29tcHJlc3NXb3JrZXI9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IGgoXCJJbmZsYXRlXCIse30pfX0se1wiLi9zdHJlYW0vR2VuZXJpY1dvcmtlclwiOjI4LFwiLi91dGlsc1wiOjMyLHBha286Mzh9XSw4OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gQShlLHQpe3ZhciByLG49XCJcIjtmb3Iocj0wO3I8dDtyKyspbis9U3RyaW5nLmZyb21DaGFyQ29kZSgyNTUmZSksZT4+Pj04O3JldHVybiBufWZ1bmN0aW9uIG4oZSx0LHIsbixpLHMpe3ZhciBhLG8saD1lLmZpbGUsdT1lLmNvbXByZXNzaW9uLGw9cyE9PU8udXRmOGVuY29kZSxmPUkudHJhbnNmb3JtVG8oXCJzdHJpbmdcIixzKGgubmFtZSkpLGM9SS50cmFuc2Zvcm1UbyhcInN0cmluZ1wiLE8udXRmOGVuY29kZShoLm5hbWUpKSxkPWguY29tbWVudCxwPUkudHJhbnNmb3JtVG8oXCJzdHJpbmdcIixzKGQpKSxtPUkudHJhbnNmb3JtVG8oXCJzdHJpbmdcIixPLnV0ZjhlbmNvZGUoZCkpLF89Yy5sZW5ndGghPT1oLm5hbWUubGVuZ3RoLGc9bS5sZW5ndGghPT1kLmxlbmd0aCxiPVwiXCIsdj1cIlwiLHk9XCJcIix3PWguZGlyLGs9aC5kYXRlLHg9e2NyYzMyOjAsY29tcHJlc3NlZFNpemU6MCx1bmNvbXByZXNzZWRTaXplOjB9O3QmJiFyfHwoeC5jcmMzMj1lLmNyYzMyLHguY29tcHJlc3NlZFNpemU9ZS5jb21wcmVzc2VkU2l6ZSx4LnVuY29tcHJlc3NlZFNpemU9ZS51bmNvbXByZXNzZWRTaXplKTt2YXIgUz0wO3QmJihTfD04KSxsfHwhXyYmIWd8fChTfD0yMDQ4KTt2YXIgej0wLEM9MDt3JiYoenw9MTYpLFwiVU5JWFwiPT09aT8oQz03OTgsenw9ZnVuY3Rpb24oZSx0KXt2YXIgcj1lO3JldHVybiBlfHwocj10PzE2ODkzOjMzMjA0KSwoNjU1MzUmcik8PDE2fShoLnVuaXhQZXJtaXNzaW9ucyx3KSk6KEM9MjAsenw9ZnVuY3Rpb24oZSl7cmV0dXJuIDYzJihlfHwwKX0oaC5kb3NQZXJtaXNzaW9ucykpLGE9ay5nZXRVVENIb3VycygpLGE8PD02LGF8PWsuZ2V0VVRDTWludXRlcygpLGE8PD01LGF8PWsuZ2V0VVRDU2Vjb25kcygpLzIsbz1rLmdldFVUQ0Z1bGxZZWFyKCktMTk4MCxvPDw9NCxvfD1rLmdldFVUQ01vbnRoKCkrMSxvPDw9NSxvfD1rLmdldFVUQ0RhdGUoKSxfJiYodj1BKDEsMSkrQShCKGYpLDQpK2MsYis9XCJ1cFwiK0Eodi5sZW5ndGgsMikrdiksZyYmKHk9QSgxLDEpK0EoQihwKSw0KSttLGIrPVwidWNcIitBKHkubGVuZ3RoLDIpK3kpO3ZhciBFPVwiXCI7cmV0dXJuIEUrPVwiXFxuXFwwXCIsRSs9QShTLDIpLEUrPXUubWFnaWMsRSs9QShhLDIpLEUrPUEobywyKSxFKz1BKHguY3JjMzIsNCksRSs9QSh4LmNvbXByZXNzZWRTaXplLDQpLEUrPUEoeC51bmNvbXByZXNzZWRTaXplLDQpLEUrPUEoZi5sZW5ndGgsMiksRSs9QShiLmxlbmd0aCwyKSx7ZmlsZVJlY29yZDpSLkxPQ0FMX0ZJTEVfSEVBREVSK0UrZitiLGRpclJlY29yZDpSLkNFTlRSQUxfRklMRV9IRUFERVIrQShDLDIpK0UrQShwLmxlbmd0aCwyKStcIlxcMFxcMFxcMFxcMFwiK0Eoeiw0KStBKG4sNCkrZitiK3B9fXZhciBJPWUoXCIuLi91dGlsc1wiKSxpPWUoXCIuLi9zdHJlYW0vR2VuZXJpY1dvcmtlclwiKSxPPWUoXCIuLi91dGY4XCIpLEI9ZShcIi4uL2NyYzMyXCIpLFI9ZShcIi4uL3NpZ25hdHVyZVwiKTtmdW5jdGlvbiBzKGUsdCxyLG4pe2kuY2FsbCh0aGlzLFwiWmlwRmlsZVdvcmtlclwiKSx0aGlzLmJ5dGVzV3JpdHRlbj0wLHRoaXMuemlwQ29tbWVudD10LHRoaXMuemlwUGxhdGZvcm09cix0aGlzLmVuY29kZUZpbGVOYW1lPW4sdGhpcy5zdHJlYW1GaWxlcz1lLHRoaXMuYWNjdW11bGF0ZT0hMSx0aGlzLmNvbnRlbnRCdWZmZXI9W10sdGhpcy5kaXJSZWNvcmRzPVtdLHRoaXMuY3VycmVudFNvdXJjZU9mZnNldD0wLHRoaXMuZW50cmllc0NvdW50PTAsdGhpcy5jdXJyZW50RmlsZT1udWxsLHRoaXMuX3NvdXJjZXM9W119SS5pbmhlcml0cyhzLGkpLHMucHJvdG90eXBlLnB1c2g9ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5tZXRhLnBlcmNlbnR8fDAscj10aGlzLmVudHJpZXNDb3VudCxuPXRoaXMuX3NvdXJjZXMubGVuZ3RoO3RoaXMuYWNjdW11bGF0ZT90aGlzLmNvbnRlbnRCdWZmZXIucHVzaChlKToodGhpcy5ieXRlc1dyaXR0ZW4rPWUuZGF0YS5sZW5ndGgsaS5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMse2RhdGE6ZS5kYXRhLG1ldGE6e2N1cnJlbnRGaWxlOnRoaXMuY3VycmVudEZpbGUscGVyY2VudDpyPyh0KzEwMCooci1uLTEpKS9yOjEwMH19KSl9LHMucHJvdG90eXBlLm9wZW5lZFNvdXJjZT1mdW5jdGlvbihlKXt0aGlzLmN1cnJlbnRTb3VyY2VPZmZzZXQ9dGhpcy5ieXRlc1dyaXR0ZW4sdGhpcy5jdXJyZW50RmlsZT1lLmZpbGUubmFtZTt2YXIgdD10aGlzLnN0cmVhbUZpbGVzJiYhZS5maWxlLmRpcjtpZih0KXt2YXIgcj1uKGUsdCwhMSx0aGlzLmN1cnJlbnRTb3VyY2VPZmZzZXQsdGhpcy56aXBQbGF0Zm9ybSx0aGlzLmVuY29kZUZpbGVOYW1lKTt0aGlzLnB1c2goe2RhdGE6ci5maWxlUmVjb3JkLG1ldGE6e3BlcmNlbnQ6MH19KX1lbHNlIHRoaXMuYWNjdW11bGF0ZT0hMH0scy5wcm90b3R5cGUuY2xvc2VkU291cmNlPWZ1bmN0aW9uKGUpe3RoaXMuYWNjdW11bGF0ZT0hMTt2YXIgdD10aGlzLnN0cmVhbUZpbGVzJiYhZS5maWxlLmRpcixyPW4oZSx0LCEwLHRoaXMuY3VycmVudFNvdXJjZU9mZnNldCx0aGlzLnppcFBsYXRmb3JtLHRoaXMuZW5jb2RlRmlsZU5hbWUpO2lmKHRoaXMuZGlyUmVjb3Jkcy5wdXNoKHIuZGlyUmVjb3JkKSx0KXRoaXMucHVzaCh7ZGF0YTpmdW5jdGlvbihlKXtyZXR1cm4gUi5EQVRBX0RFU0NSSVBUT1IrQShlLmNyYzMyLDQpK0EoZS5jb21wcmVzc2VkU2l6ZSw0KStBKGUudW5jb21wcmVzc2VkU2l6ZSw0KX0oZSksbWV0YTp7cGVyY2VudDoxMDB9fSk7ZWxzZSBmb3IodGhpcy5wdXNoKHtkYXRhOnIuZmlsZVJlY29yZCxtZXRhOntwZXJjZW50OjB9fSk7dGhpcy5jb250ZW50QnVmZmVyLmxlbmd0aDspdGhpcy5wdXNoKHRoaXMuY29udGVudEJ1ZmZlci5zaGlmdCgpKTt0aGlzLmN1cnJlbnRGaWxlPW51bGx9LHMucHJvdG90eXBlLmZsdXNoPWZ1bmN0aW9uKCl7Zm9yKHZhciBlPXRoaXMuYnl0ZXNXcml0dGVuLHQ9MDt0PHRoaXMuZGlyUmVjb3Jkcy5sZW5ndGg7dCsrKXRoaXMucHVzaCh7ZGF0YTp0aGlzLmRpclJlY29yZHNbdF0sbWV0YTp7cGVyY2VudDoxMDB9fSk7dmFyIHI9dGhpcy5ieXRlc1dyaXR0ZW4tZSxuPWZ1bmN0aW9uKGUsdCxyLG4saSl7dmFyIHM9SS50cmFuc2Zvcm1UbyhcInN0cmluZ1wiLGkobikpO3JldHVybiBSLkNFTlRSQUxfRElSRUNUT1JZX0VORCtcIlxcMFxcMFxcMFxcMFwiK0EoZSwyKStBKGUsMikrQSh0LDQpK0Eociw0KStBKHMubGVuZ3RoLDIpK3N9KHRoaXMuZGlyUmVjb3Jkcy5sZW5ndGgscixlLHRoaXMuemlwQ29tbWVudCx0aGlzLmVuY29kZUZpbGVOYW1lKTt0aGlzLnB1c2goe2RhdGE6bixtZXRhOntwZXJjZW50OjEwMH19KX0scy5wcm90b3R5cGUucHJlcGFyZU5leHRTb3VyY2U9ZnVuY3Rpb24oKXt0aGlzLnByZXZpb3VzPXRoaXMuX3NvdXJjZXMuc2hpZnQoKSx0aGlzLm9wZW5lZFNvdXJjZSh0aGlzLnByZXZpb3VzLnN0cmVhbUluZm8pLHRoaXMuaXNQYXVzZWQ/dGhpcy5wcmV2aW91cy5wYXVzZSgpOnRoaXMucHJldmlvdXMucmVzdW1lKCl9LHMucHJvdG90eXBlLnJlZ2lzdGVyUHJldmlvdXM9ZnVuY3Rpb24oZSl7dGhpcy5fc291cmNlcy5wdXNoKGUpO3ZhciB0PXRoaXM7cmV0dXJuIGUub24oXCJkYXRhXCIsZnVuY3Rpb24oZSl7dC5wcm9jZXNzQ2h1bmsoZSl9KSxlLm9uKFwiZW5kXCIsZnVuY3Rpb24oKXt0LmNsb3NlZFNvdXJjZSh0LnByZXZpb3VzLnN0cmVhbUluZm8pLHQuX3NvdXJjZXMubGVuZ3RoP3QucHJlcGFyZU5leHRTb3VyY2UoKTp0LmVuZCgpfSksZS5vbihcImVycm9yXCIsZnVuY3Rpb24oZSl7dC5lcnJvcihlKX0pLHRoaXN9LHMucHJvdG90eXBlLnJlc3VtZT1mdW5jdGlvbigpe3JldHVybiEhaS5wcm90b3R5cGUucmVzdW1lLmNhbGwodGhpcykmJighdGhpcy5wcmV2aW91cyYmdGhpcy5fc291cmNlcy5sZW5ndGg/KHRoaXMucHJlcGFyZU5leHRTb3VyY2UoKSwhMCk6dGhpcy5wcmV2aW91c3x8dGhpcy5fc291cmNlcy5sZW5ndGh8fHRoaXMuZ2VuZXJhdGVkRXJyb3I/dm9pZCAwOih0aGlzLmVuZCgpLCEwKSl9LHMucHJvdG90eXBlLmVycm9yPWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMuX3NvdXJjZXM7aWYoIWkucHJvdG90eXBlLmVycm9yLmNhbGwodGhpcyxlKSlyZXR1cm4hMTtmb3IodmFyIHI9MDtyPHQubGVuZ3RoO3IrKyl0cnl7dFtyXS5lcnJvcihlKX1jYXRjaChlKXt9cmV0dXJuITB9LHMucHJvdG90eXBlLmxvY2s9ZnVuY3Rpb24oKXtpLnByb3RvdHlwZS5sb2NrLmNhbGwodGhpcyk7Zm9yKHZhciBlPXRoaXMuX3NvdXJjZXMsdD0wO3Q8ZS5sZW5ndGg7dCsrKWVbdF0ubG9jaygpfSx0LmV4cG9ydHM9c30se1wiLi4vY3JjMzJcIjo0LFwiLi4vc2lnbmF0dXJlXCI6MjMsXCIuLi9zdHJlYW0vR2VuZXJpY1dvcmtlclwiOjI4LFwiLi4vdXRmOFwiOjMxLFwiLi4vdXRpbHNcIjozMn1dLDk6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgdT1lKFwiLi4vY29tcHJlc3Npb25zXCIpLG49ZShcIi4vWmlwRmlsZVdvcmtlclwiKTtyLmdlbmVyYXRlV29ya2VyPWZ1bmN0aW9uKGUsYSx0KXt2YXIgbz1uZXcgbihhLnN0cmVhbUZpbGVzLHQsYS5wbGF0Zm9ybSxhLmVuY29kZUZpbGVOYW1lKSxoPTA7dHJ5e2UuZm9yRWFjaChmdW5jdGlvbihlLHQpe2grKzt2YXIgcj1mdW5jdGlvbihlLHQpe3ZhciByPWV8fHQsbj11W3JdO2lmKCFuKXRocm93IG5ldyBFcnJvcihyK1wiIGlzIG5vdCBhIHZhbGlkIGNvbXByZXNzaW9uIG1ldGhvZCAhXCIpO3JldHVybiBufSh0Lm9wdGlvbnMuY29tcHJlc3Npb24sYS5jb21wcmVzc2lvbiksbj10Lm9wdGlvbnMuY29tcHJlc3Npb25PcHRpb25zfHxhLmNvbXByZXNzaW9uT3B0aW9uc3x8e30saT10LmRpcixzPXQuZGF0ZTt0Ll9jb21wcmVzc1dvcmtlcihyLG4pLndpdGhTdHJlYW1JbmZvKFwiZmlsZVwiLHtuYW1lOmUsZGlyOmksZGF0ZTpzLGNvbW1lbnQ6dC5jb21tZW50fHxcIlwiLHVuaXhQZXJtaXNzaW9uczp0LnVuaXhQZXJtaXNzaW9ucyxkb3NQZXJtaXNzaW9uczp0LmRvc1Blcm1pc3Npb25zfSkucGlwZShvKX0pLG8uZW50cmllc0NvdW50PWh9Y2F0Y2goZSl7by5lcnJvcihlKX1yZXR1cm4gb319LHtcIi4uL2NvbXByZXNzaW9uc1wiOjMsXCIuL1ppcEZpbGVXb3JrZXJcIjo4fV0sMTA6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKCl7aWYoISh0aGlzIGluc3RhbmNlb2YgbikpcmV0dXJuIG5ldyBuO2lmKGFyZ3VtZW50cy5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKFwiVGhlIGNvbnN0cnVjdG9yIHdpdGggcGFyYW1ldGVycyBoYXMgYmVlbiByZW1vdmVkIGluIEpTWmlwIDMuMCwgcGxlYXNlIGNoZWNrIHRoZSB1cGdyYWRlIGd1aWRlLlwiKTt0aGlzLmZpbGVzPU9iamVjdC5jcmVhdGUobnVsbCksdGhpcy5jb21tZW50PW51bGwsdGhpcy5yb290PVwiXCIsdGhpcy5jbG9uZT1mdW5jdGlvbigpe3ZhciBlPW5ldyBuO2Zvcih2YXIgdCBpbiB0aGlzKVwiZnVuY3Rpb25cIiE9dHlwZW9mIHRoaXNbdF0mJihlW3RdPXRoaXNbdF0pO3JldHVybiBlfX0obi5wcm90b3R5cGU9ZShcIi4vb2JqZWN0XCIpKS5sb2FkQXN5bmM9ZShcIi4vbG9hZFwiKSxuLnN1cHBvcnQ9ZShcIi4vc3VwcG9ydFwiKSxuLmRlZmF1bHRzPWUoXCIuL2RlZmF1bHRzXCIpLG4udmVyc2lvbj1cIjMuMTAuMVwiLG4ubG9hZEFzeW5jPWZ1bmN0aW9uKGUsdCl7cmV0dXJuKG5ldyBuKS5sb2FkQXN5bmMoZSx0KX0sbi5leHRlcm5hbD1lKFwiLi9leHRlcm5hbFwiKSx0LmV4cG9ydHM9bn0se1wiLi9kZWZhdWx0c1wiOjUsXCIuL2V4dGVybmFsXCI6NixcIi4vbG9hZFwiOjExLFwiLi9vYmplY3RcIjoxNSxcIi4vc3VwcG9ydFwiOjMwfV0sMTE6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgdT1lKFwiLi91dGlsc1wiKSxpPWUoXCIuL2V4dGVybmFsXCIpLG49ZShcIi4vdXRmOFwiKSxzPWUoXCIuL3ppcEVudHJpZXNcIiksYT1lKFwiLi9zdHJlYW0vQ3JjMzJQcm9iZVwiKSxsPWUoXCIuL25vZGVqc1V0aWxzXCIpO2Z1bmN0aW9uIGYobil7cmV0dXJuIG5ldyBpLlByb21pc2UoZnVuY3Rpb24oZSx0KXt2YXIgcj1uLmRlY29tcHJlc3NlZC5nZXRDb250ZW50V29ya2VyKCkucGlwZShuZXcgYSk7ci5vbihcImVycm9yXCIsZnVuY3Rpb24oZSl7dChlKX0pLm9uKFwiZW5kXCIsZnVuY3Rpb24oKXtyLnN0cmVhbUluZm8uY3JjMzIhPT1uLmRlY29tcHJlc3NlZC5jcmMzMj90KG5ldyBFcnJvcihcIkNvcnJ1cHRlZCB6aXAgOiBDUkMzMiBtaXNtYXRjaFwiKSk6ZSgpfSkucmVzdW1lKCl9KX10LmV4cG9ydHM9ZnVuY3Rpb24oZSxvKXt2YXIgaD10aGlzO3JldHVybiBvPXUuZXh0ZW5kKG98fHt9LHtiYXNlNjQ6ITEsY2hlY2tDUkMzMjohMSxvcHRpbWl6ZWRCaW5hcnlTdHJpbmc6ITEsY3JlYXRlRm9sZGVyczohMSxkZWNvZGVGaWxlTmFtZTpuLnV0ZjhkZWNvZGV9KSxsLmlzTm9kZSYmbC5pc1N0cmVhbShlKT9pLlByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkpTWmlwIGNhbid0IGFjY2VwdCBhIHN0cmVhbSB3aGVuIGxvYWRpbmcgYSB6aXAgZmlsZS5cIikpOnUucHJlcGFyZUNvbnRlbnQoXCJ0aGUgbG9hZGVkIHppcCBmaWxlXCIsZSwhMCxvLm9wdGltaXplZEJpbmFyeVN0cmluZyxvLmJhc2U2NCkudGhlbihmdW5jdGlvbihlKXt2YXIgdD1uZXcgcyhvKTtyZXR1cm4gdC5sb2FkKGUpLHR9KS50aGVuKGZ1bmN0aW9uKGUpe3ZhciB0PVtpLlByb21pc2UucmVzb2x2ZShlKV0scj1lLmZpbGVzO2lmKG8uY2hlY2tDUkMzMilmb3IodmFyIG49MDtuPHIubGVuZ3RoO24rKyl0LnB1c2goZihyW25dKSk7cmV0dXJuIGkuUHJvbWlzZS5hbGwodCl9KS50aGVuKGZ1bmN0aW9uKGUpe2Zvcih2YXIgdD1lLnNoaWZ0KCkscj10LmZpbGVzLG49MDtuPHIubGVuZ3RoO24rKyl7dmFyIGk9cltuXSxzPWkuZmlsZU5hbWVTdHIsYT11LnJlc29sdmUoaS5maWxlTmFtZVN0cik7aC5maWxlKGEsaS5kZWNvbXByZXNzZWQse2JpbmFyeTohMCxvcHRpbWl6ZWRCaW5hcnlTdHJpbmc6ITAsZGF0ZTppLmRhdGUsZGlyOmkuZGlyLGNvbW1lbnQ6aS5maWxlQ29tbWVudFN0ci5sZW5ndGg/aS5maWxlQ29tbWVudFN0cjpudWxsLHVuaXhQZXJtaXNzaW9uczppLnVuaXhQZXJtaXNzaW9ucyxkb3NQZXJtaXNzaW9uczppLmRvc1Blcm1pc3Npb25zLGNyZWF0ZUZvbGRlcnM6by5jcmVhdGVGb2xkZXJzfSksaS5kaXJ8fChoLmZpbGUoYSkudW5zYWZlT3JpZ2luYWxOYW1lPXMpfXJldHVybiB0LnppcENvbW1lbnQubGVuZ3RoJiYoaC5jb21tZW50PXQuemlwQ29tbWVudCksaH0pfX0se1wiLi9leHRlcm5hbFwiOjYsXCIuL25vZGVqc1V0aWxzXCI6MTQsXCIuL3N0cmVhbS9DcmMzMlByb2JlXCI6MjUsXCIuL3V0ZjhcIjozMSxcIi4vdXRpbHNcIjozMixcIi4vemlwRW50cmllc1wiOjMzfV0sMTI6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1lKFwiLi4vdXRpbHNcIiksaT1lKFwiLi4vc3RyZWFtL0dlbmVyaWNXb3JrZXJcIik7ZnVuY3Rpb24gcyhlLHQpe2kuY2FsbCh0aGlzLFwiTm9kZWpzIHN0cmVhbSBpbnB1dCBhZGFwdGVyIGZvciBcIitlKSx0aGlzLl91cHN0cmVhbUVuZGVkPSExLHRoaXMuX2JpbmRTdHJlYW0odCl9bi5pbmhlcml0cyhzLGkpLHMucHJvdG90eXBlLl9iaW5kU3RyZWFtPWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXM7KHRoaXMuX3N0cmVhbT1lKS5wYXVzZSgpLGUub24oXCJkYXRhXCIsZnVuY3Rpb24oZSl7dC5wdXNoKHtkYXRhOmUsbWV0YTp7cGVyY2VudDowfX0pfSkub24oXCJlcnJvclwiLGZ1bmN0aW9uKGUpe3QuaXNQYXVzZWQ/dGhpcy5nZW5lcmF0ZWRFcnJvcj1lOnQuZXJyb3IoZSl9KS5vbihcImVuZFwiLGZ1bmN0aW9uKCl7dC5pc1BhdXNlZD90Ll91cHN0cmVhbUVuZGVkPSEwOnQuZW5kKCl9KX0scy5wcm90b3R5cGUucGF1c2U9ZnVuY3Rpb24oKXtyZXR1cm4hIWkucHJvdG90eXBlLnBhdXNlLmNhbGwodGhpcykmJih0aGlzLl9zdHJlYW0ucGF1c2UoKSwhMCl9LHMucHJvdG90eXBlLnJlc3VtZT1mdW5jdGlvbigpe3JldHVybiEhaS5wcm90b3R5cGUucmVzdW1lLmNhbGwodGhpcykmJih0aGlzLl91cHN0cmVhbUVuZGVkP3RoaXMuZW5kKCk6dGhpcy5fc3RyZWFtLnJlc3VtZSgpLCEwKX0sdC5leHBvcnRzPXN9LHtcIi4uL3N0cmVhbS9HZW5lcmljV29ya2VyXCI6MjgsXCIuLi91dGlsc1wiOjMyfV0sMTM6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgaT1lKFwicmVhZGFibGUtc3RyZWFtXCIpLlJlYWRhYmxlO2Z1bmN0aW9uIG4oZSx0LHIpe2kuY2FsbCh0aGlzLHQpLHRoaXMuX2hlbHBlcj1lO3ZhciBuPXRoaXM7ZS5vbihcImRhdGFcIixmdW5jdGlvbihlLHQpe24ucHVzaChlKXx8bi5faGVscGVyLnBhdXNlKCksciYmcih0KX0pLm9uKFwiZXJyb3JcIixmdW5jdGlvbihlKXtuLmVtaXQoXCJlcnJvclwiLGUpfSkub24oXCJlbmRcIixmdW5jdGlvbigpe24ucHVzaChudWxsKX0pfWUoXCIuLi91dGlsc1wiKS5pbmhlcml0cyhuLGkpLG4ucHJvdG90eXBlLl9yZWFkPWZ1bmN0aW9uKCl7dGhpcy5faGVscGVyLnJlc3VtZSgpfSx0LmV4cG9ydHM9bn0se1wiLi4vdXRpbHNcIjozMixcInJlYWRhYmxlLXN0cmVhbVwiOjE2fV0sMTQ6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt0LmV4cG9ydHM9e2lzTm9kZTpcInVuZGVmaW5lZFwiIT10eXBlb2YgQnVmZmVyLG5ld0J1ZmZlckZyb206ZnVuY3Rpb24oZSx0KXtpZihCdWZmZXIuZnJvbSYmQnVmZmVyLmZyb20hPT1VaW50OEFycmF5LmZyb20pcmV0dXJuIEJ1ZmZlci5mcm9tKGUsdCk7aWYoXCJudW1iZXJcIj09dHlwZW9mIGUpdGhyb3cgbmV3IEVycm9yKCdUaGUgXCJkYXRhXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKTtyZXR1cm4gbmV3IEJ1ZmZlcihlLHQpfSxhbGxvY0J1ZmZlcjpmdW5jdGlvbihlKXtpZihCdWZmZXIuYWxsb2MpcmV0dXJuIEJ1ZmZlci5hbGxvYyhlKTt2YXIgdD1uZXcgQnVmZmVyKGUpO3JldHVybiB0LmZpbGwoMCksdH0saXNCdWZmZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIEJ1ZmZlci5pc0J1ZmZlcihlKX0saXNTdHJlYW06ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGUub24mJlwiZnVuY3Rpb25cIj09dHlwZW9mIGUucGF1c2UmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGUucmVzdW1lfX19LHt9XSwxNTpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHMoZSx0LHIpe3ZhciBuLGk9dS5nZXRUeXBlT2YodCkscz11LmV4dGVuZChyfHx7fSxmKTtzLmRhdGU9cy5kYXRlfHxuZXcgRGF0ZSxudWxsIT09cy5jb21wcmVzc2lvbiYmKHMuY29tcHJlc3Npb249cy5jb21wcmVzc2lvbi50b1VwcGVyQ2FzZSgpKSxcInN0cmluZ1wiPT10eXBlb2Ygcy51bml4UGVybWlzc2lvbnMmJihzLnVuaXhQZXJtaXNzaW9ucz1wYXJzZUludChzLnVuaXhQZXJtaXNzaW9ucyw4KSkscy51bml4UGVybWlzc2lvbnMmJjE2Mzg0JnMudW5peFBlcm1pc3Npb25zJiYocy5kaXI9ITApLHMuZG9zUGVybWlzc2lvbnMmJjE2JnMuZG9zUGVybWlzc2lvbnMmJihzLmRpcj0hMCkscy5kaXImJihlPWcoZSkpLHMuY3JlYXRlRm9sZGVycyYmKG49XyhlKSkmJmIuY2FsbCh0aGlzLG4sITApO3ZhciBhPVwic3RyaW5nXCI9PT1pJiYhMT09PXMuYmluYXJ5JiYhMT09PXMuYmFzZTY0O3ImJnZvaWQgMCE9PXIuYmluYXJ5fHwocy5iaW5hcnk9IWEpLCh0IGluc3RhbmNlb2YgYyYmMD09PXQudW5jb21wcmVzc2VkU2l6ZXx8cy5kaXJ8fCF0fHwwPT09dC5sZW5ndGgpJiYocy5iYXNlNjQ9ITEscy5iaW5hcnk9ITAsdD1cIlwiLHMuY29tcHJlc3Npb249XCJTVE9SRVwiLGk9XCJzdHJpbmdcIik7dmFyIG89bnVsbDtvPXQgaW5zdGFuY2VvZiBjfHx0IGluc3RhbmNlb2YgbD90OnAuaXNOb2RlJiZwLmlzU3RyZWFtKHQpP25ldyBtKGUsdCk6dS5wcmVwYXJlQ29udGVudChlLHQscy5iaW5hcnkscy5vcHRpbWl6ZWRCaW5hcnlTdHJpbmcscy5iYXNlNjQpO3ZhciBoPW5ldyBkKGUsbyxzKTt0aGlzLmZpbGVzW2VdPWh9dmFyIGk9ZShcIi4vdXRmOFwiKSx1PWUoXCIuL3V0aWxzXCIpLGw9ZShcIi4vc3RyZWFtL0dlbmVyaWNXb3JrZXJcIiksYT1lKFwiLi9zdHJlYW0vU3RyZWFtSGVscGVyXCIpLGY9ZShcIi4vZGVmYXVsdHNcIiksYz1lKFwiLi9jb21wcmVzc2VkT2JqZWN0XCIpLGQ9ZShcIi4vemlwT2JqZWN0XCIpLG89ZShcIi4vZ2VuZXJhdGVcIikscD1lKFwiLi9ub2RlanNVdGlsc1wiKSxtPWUoXCIuL25vZGVqcy9Ob2RlanNTdHJlYW1JbnB1dEFkYXB0ZXJcIiksXz1mdW5jdGlvbihlKXtcIi9cIj09PWUuc2xpY2UoLTEpJiYoZT1lLnN1YnN0cmluZygwLGUubGVuZ3RoLTEpKTt2YXIgdD1lLmxhc3RJbmRleE9mKFwiL1wiKTtyZXR1cm4gMDx0P2Uuc3Vic3RyaW5nKDAsdCk6XCJcIn0sZz1mdW5jdGlvbihlKXtyZXR1cm5cIi9cIiE9PWUuc2xpY2UoLTEpJiYoZSs9XCIvXCIpLGV9LGI9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdD12b2lkIDAhPT10P3Q6Zi5jcmVhdGVGb2xkZXJzLGU9ZyhlKSx0aGlzLmZpbGVzW2VdfHxzLmNhbGwodGhpcyxlLG51bGwse2RpcjohMCxjcmVhdGVGb2xkZXJzOnR9KSx0aGlzLmZpbGVzW2VdfTtmdW5jdGlvbiBoKGUpe3JldHVyblwiW29iamVjdCBSZWdFeHBdXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZSl9dmFyIG49e2xvYWQ6ZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIG1ldGhvZCBoYXMgYmVlbiByZW1vdmVkIGluIEpTWmlwIDMuMCwgcGxlYXNlIGNoZWNrIHRoZSB1cGdyYWRlIGd1aWRlLlwiKX0sZm9yRWFjaDpmdW5jdGlvbihlKXt2YXIgdCxyLG47Zm9yKHQgaW4gdGhpcy5maWxlcyluPXRoaXMuZmlsZXNbdF0sKHI9dC5zbGljZSh0aGlzLnJvb3QubGVuZ3RoLHQubGVuZ3RoKSkmJnQuc2xpY2UoMCx0aGlzLnJvb3QubGVuZ3RoKT09PXRoaXMucm9vdCYmZShyLG4pfSxmaWx0ZXI6ZnVuY3Rpb24ocil7dmFyIG49W107cmV0dXJuIHRoaXMuZm9yRWFjaChmdW5jdGlvbihlLHQpe3IoZSx0KSYmbi5wdXNoKHQpfSksbn0sZmlsZTpmdW5jdGlvbihlLHQscil7aWYoMSE9PWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuIGU9dGhpcy5yb290K2Uscy5jYWxsKHRoaXMsZSx0LHIpLHRoaXM7aWYoaChlKSl7dmFyIG49ZTtyZXR1cm4gdGhpcy5maWx0ZXIoZnVuY3Rpb24oZSx0KXtyZXR1cm4hdC5kaXImJm4udGVzdChlKX0pfXZhciBpPXRoaXMuZmlsZXNbdGhpcy5yb290K2VdO3JldHVybiBpJiYhaS5kaXI/aTpudWxsfSxmb2xkZXI6ZnVuY3Rpb24ocil7aWYoIXIpcmV0dXJuIHRoaXM7aWYoaChyKSlyZXR1cm4gdGhpcy5maWx0ZXIoZnVuY3Rpb24oZSx0KXtyZXR1cm4gdC5kaXImJnIudGVzdChlKX0pO3ZhciBlPXRoaXMucm9vdCtyLHQ9Yi5jYWxsKHRoaXMsZSksbj10aGlzLmNsb25lKCk7cmV0dXJuIG4ucm9vdD10Lm5hbWUsbn0scmVtb3ZlOmZ1bmN0aW9uKHIpe3I9dGhpcy5yb290K3I7dmFyIGU9dGhpcy5maWxlc1tyXTtpZihlfHwoXCIvXCIhPT1yLnNsaWNlKC0xKSYmKHIrPVwiL1wiKSxlPXRoaXMuZmlsZXNbcl0pLGUmJiFlLmRpcilkZWxldGUgdGhpcy5maWxlc1tyXTtlbHNlIGZvcih2YXIgdD10aGlzLmZpbHRlcihmdW5jdGlvbihlLHQpe3JldHVybiB0Lm5hbWUuc2xpY2UoMCxyLmxlbmd0aCk9PT1yfSksbj0wO248dC5sZW5ndGg7bisrKWRlbGV0ZSB0aGlzLmZpbGVzW3Rbbl0ubmFtZV07cmV0dXJuIHRoaXN9LGdlbmVyYXRlOmZ1bmN0aW9uKCl7dGhyb3cgbmV3IEVycm9yKFwiVGhpcyBtZXRob2QgaGFzIGJlZW4gcmVtb3ZlZCBpbiBKU1ppcCAzLjAsIHBsZWFzZSBjaGVjayB0aGUgdXBncmFkZSBndWlkZS5cIil9LGdlbmVyYXRlSW50ZXJuYWxTdHJlYW06ZnVuY3Rpb24oZSl7dmFyIHQscj17fTt0cnl7aWYoKHI9dS5leHRlbmQoZXx8e30se3N0cmVhbUZpbGVzOiExLGNvbXByZXNzaW9uOlwiU1RPUkVcIixjb21wcmVzc2lvbk9wdGlvbnM6bnVsbCx0eXBlOlwiXCIscGxhdGZvcm06XCJET1NcIixjb21tZW50Om51bGwsbWltZVR5cGU6XCJhcHBsaWNhdGlvbi96aXBcIixlbmNvZGVGaWxlTmFtZTppLnV0ZjhlbmNvZGV9KSkudHlwZT1yLnR5cGUudG9Mb3dlckNhc2UoKSxyLmNvbXByZXNzaW9uPXIuY29tcHJlc3Npb24udG9VcHBlckNhc2UoKSxcImJpbmFyeXN0cmluZ1wiPT09ci50eXBlJiYoci50eXBlPVwic3RyaW5nXCIpLCFyLnR5cGUpdGhyb3cgbmV3IEVycm9yKFwiTm8gb3V0cHV0IHR5cGUgc3BlY2lmaWVkLlwiKTt1LmNoZWNrU3VwcG9ydChyLnR5cGUpLFwiZGFyd2luXCIhPT1yLnBsYXRmb3JtJiZcImZyZWVic2RcIiE9PXIucGxhdGZvcm0mJlwibGludXhcIiE9PXIucGxhdGZvcm0mJlwic3Vub3NcIiE9PXIucGxhdGZvcm18fChyLnBsYXRmb3JtPVwiVU5JWFwiKSxcIndpbjMyXCI9PT1yLnBsYXRmb3JtJiYoci5wbGF0Zm9ybT1cIkRPU1wiKTt2YXIgbj1yLmNvbW1lbnR8fHRoaXMuY29tbWVudHx8XCJcIjt0PW8uZ2VuZXJhdGVXb3JrZXIodGhpcyxyLG4pfWNhdGNoKGUpeyh0PW5ldyBsKFwiZXJyb3JcIikpLmVycm9yKGUpfXJldHVybiBuZXcgYSh0LHIudHlwZXx8XCJzdHJpbmdcIixyLm1pbWVUeXBlKX0sZ2VuZXJhdGVBc3luYzpmdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLmdlbmVyYXRlSW50ZXJuYWxTdHJlYW0oZSkuYWNjdW11bGF0ZSh0KX0sZ2VuZXJhdGVOb2RlU3RyZWFtOmZ1bmN0aW9uKGUsdCl7cmV0dXJuKGU9ZXx8e30pLnR5cGV8fChlLnR5cGU9XCJub2RlYnVmZmVyXCIpLHRoaXMuZ2VuZXJhdGVJbnRlcm5hbFN0cmVhbShlKS50b05vZGVqc1N0cmVhbSh0KX19O3QuZXhwb3J0cz1ufSx7XCIuL2NvbXByZXNzZWRPYmplY3RcIjoyLFwiLi9kZWZhdWx0c1wiOjUsXCIuL2dlbmVyYXRlXCI6OSxcIi4vbm9kZWpzL05vZGVqc1N0cmVhbUlucHV0QWRhcHRlclwiOjEyLFwiLi9ub2RlanNVdGlsc1wiOjE0LFwiLi9zdHJlYW0vR2VuZXJpY1dvcmtlclwiOjI4LFwiLi9zdHJlYW0vU3RyZWFtSGVscGVyXCI6MjksXCIuL3V0ZjhcIjozMSxcIi4vdXRpbHNcIjozMixcIi4vemlwT2JqZWN0XCI6MzV9XSwxNjpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3QuZXhwb3J0cz1lKFwic3RyZWFtXCIpfSx7c3RyZWFtOnZvaWQgMH1dLDE3OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49ZShcIi4vRGF0YVJlYWRlclwiKTtmdW5jdGlvbiBpKGUpe24uY2FsbCh0aGlzLGUpO2Zvcih2YXIgdD0wO3Q8dGhpcy5kYXRhLmxlbmd0aDt0KyspZVt0XT0yNTUmZVt0XX1lKFwiLi4vdXRpbHNcIikuaW5oZXJpdHMoaSxuKSxpLnByb3RvdHlwZS5ieXRlQXQ9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZGF0YVt0aGlzLnplcm8rZV19LGkucHJvdG90eXBlLmxhc3RJbmRleE9mU2lnbmF0dXJlPWZ1bmN0aW9uKGUpe2Zvcih2YXIgdD1lLmNoYXJDb2RlQXQoMCkscj1lLmNoYXJDb2RlQXQoMSksbj1lLmNoYXJDb2RlQXQoMiksaT1lLmNoYXJDb2RlQXQoMykscz10aGlzLmxlbmd0aC00OzA8PXM7LS1zKWlmKHRoaXMuZGF0YVtzXT09PXQmJnRoaXMuZGF0YVtzKzFdPT09ciYmdGhpcy5kYXRhW3MrMl09PT1uJiZ0aGlzLmRhdGFbcyszXT09PWkpcmV0dXJuIHMtdGhpcy56ZXJvO3JldHVybi0xfSxpLnByb3RvdHlwZS5yZWFkQW5kQ2hlY2tTaWduYXR1cmU9ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5jaGFyQ29kZUF0KDApLHI9ZS5jaGFyQ29kZUF0KDEpLG49ZS5jaGFyQ29kZUF0KDIpLGk9ZS5jaGFyQ29kZUF0KDMpLHM9dGhpcy5yZWFkRGF0YSg0KTtyZXR1cm4gdD09PXNbMF0mJnI9PT1zWzFdJiZuPT09c1syXSYmaT09PXNbM119LGkucHJvdG90eXBlLnJlYWREYXRhPWZ1bmN0aW9uKGUpe2lmKHRoaXMuY2hlY2tPZmZzZXQoZSksMD09PWUpcmV0dXJuW107dmFyIHQ9dGhpcy5kYXRhLnNsaWNlKHRoaXMuemVybyt0aGlzLmluZGV4LHRoaXMuemVybyt0aGlzLmluZGV4K2UpO3JldHVybiB0aGlzLmluZGV4Kz1lLHR9LHQuZXhwb3J0cz1pfSx7XCIuLi91dGlsc1wiOjMyLFwiLi9EYXRhUmVhZGVyXCI6MTh9XSwxODpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPWUoXCIuLi91dGlsc1wiKTtmdW5jdGlvbiBpKGUpe3RoaXMuZGF0YT1lLHRoaXMubGVuZ3RoPWUubGVuZ3RoLHRoaXMuaW5kZXg9MCx0aGlzLnplcm89MH1pLnByb3RvdHlwZT17Y2hlY2tPZmZzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5jaGVja0luZGV4KHRoaXMuaW5kZXgrZSl9LGNoZWNrSW5kZXg6ZnVuY3Rpb24oZSl7aWYodGhpcy5sZW5ndGg8dGhpcy56ZXJvK2V8fGU8MCl0aHJvdyBuZXcgRXJyb3IoXCJFbmQgb2YgZGF0YSByZWFjaGVkIChkYXRhIGxlbmd0aCA9IFwiK3RoaXMubGVuZ3RoK1wiLCBhc2tlZCBpbmRleCA9IFwiK2UrXCIpLiBDb3JydXB0ZWQgemlwID9cIil9LHNldEluZGV4OmZ1bmN0aW9uKGUpe3RoaXMuY2hlY2tJbmRleChlKSx0aGlzLmluZGV4PWV9LHNraXA6ZnVuY3Rpb24oZSl7dGhpcy5zZXRJbmRleCh0aGlzLmluZGV4K2UpfSxieXRlQXQ6ZnVuY3Rpb24oKXt9LHJlYWRJbnQ6ZnVuY3Rpb24oZSl7dmFyIHQscj0wO2Zvcih0aGlzLmNoZWNrT2Zmc2V0KGUpLHQ9dGhpcy5pbmRleCtlLTE7dD49dGhpcy5pbmRleDt0LS0pcj0ocjw8OCkrdGhpcy5ieXRlQXQodCk7cmV0dXJuIHRoaXMuaW5kZXgrPWUscn0scmVhZFN0cmluZzpmdW5jdGlvbihlKXtyZXR1cm4gbi50cmFuc2Zvcm1UbyhcInN0cmluZ1wiLHRoaXMucmVhZERhdGEoZSkpfSxyZWFkRGF0YTpmdW5jdGlvbigpe30sbGFzdEluZGV4T2ZTaWduYXR1cmU6ZnVuY3Rpb24oKXt9LHJlYWRBbmRDaGVja1NpZ25hdHVyZTpmdW5jdGlvbigpe30scmVhZERhdGU6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLnJlYWRJbnQoNCk7cmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5ODArKGU+PjI1JjEyNyksKGU+PjIxJjE1KS0xLGU+PjE2JjMxLGU+PjExJjMxLGU+PjUmNjMsKDMxJmUpPDwxKSl9fSx0LmV4cG9ydHM9aX0se1wiLi4vdXRpbHNcIjozMn1dLDE5OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49ZShcIi4vVWludDhBcnJheVJlYWRlclwiKTtmdW5jdGlvbiBpKGUpe24uY2FsbCh0aGlzLGUpfWUoXCIuLi91dGlsc1wiKS5pbmhlcml0cyhpLG4pLGkucHJvdG90eXBlLnJlYWREYXRhPWZ1bmN0aW9uKGUpe3RoaXMuY2hlY2tPZmZzZXQoZSk7dmFyIHQ9dGhpcy5kYXRhLnNsaWNlKHRoaXMuemVybyt0aGlzLmluZGV4LHRoaXMuemVybyt0aGlzLmluZGV4K2UpO3JldHVybiB0aGlzLmluZGV4Kz1lLHR9LHQuZXhwb3J0cz1pfSx7XCIuLi91dGlsc1wiOjMyLFwiLi9VaW50OEFycmF5UmVhZGVyXCI6MjF9XSwyMDpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPWUoXCIuL0RhdGFSZWFkZXJcIik7ZnVuY3Rpb24gaShlKXtuLmNhbGwodGhpcyxlKX1lKFwiLi4vdXRpbHNcIikuaW5oZXJpdHMoaSxuKSxpLnByb3RvdHlwZS5ieXRlQXQ9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZGF0YS5jaGFyQ29kZUF0KHRoaXMuemVybytlKX0saS5wcm90b3R5cGUubGFzdEluZGV4T2ZTaWduYXR1cmU9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZGF0YS5sYXN0SW5kZXhPZihlKS10aGlzLnplcm99LGkucHJvdG90eXBlLnJlYWRBbmRDaGVja1NpZ25hdHVyZT1mdW5jdGlvbihlKXtyZXR1cm4gZT09PXRoaXMucmVhZERhdGEoNCl9LGkucHJvdG90eXBlLnJlYWREYXRhPWZ1bmN0aW9uKGUpe3RoaXMuY2hlY2tPZmZzZXQoZSk7dmFyIHQ9dGhpcy5kYXRhLnNsaWNlKHRoaXMuemVybyt0aGlzLmluZGV4LHRoaXMuemVybyt0aGlzLmluZGV4K2UpO3JldHVybiB0aGlzLmluZGV4Kz1lLHR9LHQuZXhwb3J0cz1pfSx7XCIuLi91dGlsc1wiOjMyLFwiLi9EYXRhUmVhZGVyXCI6MTh9XSwyMTpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPWUoXCIuL0FycmF5UmVhZGVyXCIpO2Z1bmN0aW9uIGkoZSl7bi5jYWxsKHRoaXMsZSl9ZShcIi4uL3V0aWxzXCIpLmluaGVyaXRzKGksbiksaS5wcm90b3R5cGUucmVhZERhdGE9ZnVuY3Rpb24oZSl7aWYodGhpcy5jaGVja09mZnNldChlKSwwPT09ZSlyZXR1cm4gbmV3IFVpbnQ4QXJyYXkoMCk7dmFyIHQ9dGhpcy5kYXRhLnN1YmFycmF5KHRoaXMuemVybyt0aGlzLmluZGV4LHRoaXMuemVybyt0aGlzLmluZGV4K2UpO3JldHVybiB0aGlzLmluZGV4Kz1lLHR9LHQuZXhwb3J0cz1pfSx7XCIuLi91dGlsc1wiOjMyLFwiLi9BcnJheVJlYWRlclwiOjE3fV0sMjI6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1lKFwiLi4vdXRpbHNcIiksaT1lKFwiLi4vc3VwcG9ydFwiKSxzPWUoXCIuL0FycmF5UmVhZGVyXCIpLGE9ZShcIi4vU3RyaW5nUmVhZGVyXCIpLG89ZShcIi4vTm9kZUJ1ZmZlclJlYWRlclwiKSxoPWUoXCIuL1VpbnQ4QXJyYXlSZWFkZXJcIik7dC5leHBvcnRzPWZ1bmN0aW9uKGUpe3ZhciB0PW4uZ2V0VHlwZU9mKGUpO3JldHVybiBuLmNoZWNrU3VwcG9ydCh0KSxcInN0cmluZ1wiIT09dHx8aS51aW50OGFycmF5P1wibm9kZWJ1ZmZlclwiPT09dD9uZXcgbyhlKTppLnVpbnQ4YXJyYXk/bmV3IGgobi50cmFuc2Zvcm1UbyhcInVpbnQ4YXJyYXlcIixlKSk6bmV3IHMobi50cmFuc2Zvcm1UbyhcImFycmF5XCIsZSkpOm5ldyBhKGUpfX0se1wiLi4vc3VwcG9ydFwiOjMwLFwiLi4vdXRpbHNcIjozMixcIi4vQXJyYXlSZWFkZXJcIjoxNyxcIi4vTm9kZUJ1ZmZlclJlYWRlclwiOjE5LFwiLi9TdHJpbmdSZWFkZXJcIjoyMCxcIi4vVWludDhBcnJheVJlYWRlclwiOjIxfV0sMjM6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjtyLkxPQ0FMX0ZJTEVfSEVBREVSPVwiUEtcdTAwMDNcdTAwMDRcIixyLkNFTlRSQUxfRklMRV9IRUFERVI9XCJQS1x1MDAwMVx1MDAwMlwiLHIuQ0VOVFJBTF9ESVJFQ1RPUllfRU5EPVwiUEtcdTAwMDVcdTAwMDZcIixyLlpJUDY0X0NFTlRSQUxfRElSRUNUT1JZX0xPQ0FUT1I9XCJQS1x1MDAwNlx1MDAwN1wiLHIuWklQNjRfQ0VOVFJBTF9ESVJFQ1RPUllfRU5EPVwiUEtcdTAwMDZcdTAwMDZcIixyLkRBVEFfREVTQ1JJUFRPUj1cIlBLXHUwMDA3XFxiXCJ9LHt9XSwyNDpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPWUoXCIuL0dlbmVyaWNXb3JrZXJcIiksaT1lKFwiLi4vdXRpbHNcIik7ZnVuY3Rpb24gcyhlKXtuLmNhbGwodGhpcyxcIkNvbnZlcnRXb3JrZXIgdG8gXCIrZSksdGhpcy5kZXN0VHlwZT1lfWkuaW5oZXJpdHMocyxuKSxzLnByb3RvdHlwZS5wcm9jZXNzQ2h1bms9ZnVuY3Rpb24oZSl7dGhpcy5wdXNoKHtkYXRhOmkudHJhbnNmb3JtVG8odGhpcy5kZXN0VHlwZSxlLmRhdGEpLG1ldGE6ZS5tZXRhfSl9LHQuZXhwb3J0cz1zfSx7XCIuLi91dGlsc1wiOjMyLFwiLi9HZW5lcmljV29ya2VyXCI6Mjh9XSwyNTpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPWUoXCIuL0dlbmVyaWNXb3JrZXJcIiksaT1lKFwiLi4vY3JjMzJcIik7ZnVuY3Rpb24gcygpe24uY2FsbCh0aGlzLFwiQ3JjMzJQcm9iZVwiKSx0aGlzLndpdGhTdHJlYW1JbmZvKFwiY3JjMzJcIiwwKX1lKFwiLi4vdXRpbHNcIikuaW5oZXJpdHMocyxuKSxzLnByb3RvdHlwZS5wcm9jZXNzQ2h1bms9ZnVuY3Rpb24oZSl7dGhpcy5zdHJlYW1JbmZvLmNyYzMyPWkoZS5kYXRhLHRoaXMuc3RyZWFtSW5mby5jcmMzMnx8MCksdGhpcy5wdXNoKGUpfSx0LmV4cG9ydHM9c30se1wiLi4vY3JjMzJcIjo0LFwiLi4vdXRpbHNcIjozMixcIi4vR2VuZXJpY1dvcmtlclwiOjI4fV0sMjY6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1lKFwiLi4vdXRpbHNcIiksaT1lKFwiLi9HZW5lcmljV29ya2VyXCIpO2Z1bmN0aW9uIHMoZSl7aS5jYWxsKHRoaXMsXCJEYXRhTGVuZ3RoUHJvYmUgZm9yIFwiK2UpLHRoaXMucHJvcE5hbWU9ZSx0aGlzLndpdGhTdHJlYW1JbmZvKGUsMCl9bi5pbmhlcml0cyhzLGkpLHMucHJvdG90eXBlLnByb2Nlc3NDaHVuaz1mdW5jdGlvbihlKXtpZihlKXt2YXIgdD10aGlzLnN0cmVhbUluZm9bdGhpcy5wcm9wTmFtZV18fDA7dGhpcy5zdHJlYW1JbmZvW3RoaXMucHJvcE5hbWVdPXQrZS5kYXRhLmxlbmd0aH1pLnByb3RvdHlwZS5wcm9jZXNzQ2h1bmsuY2FsbCh0aGlzLGUpfSx0LmV4cG9ydHM9c30se1wiLi4vdXRpbHNcIjozMixcIi4vR2VuZXJpY1dvcmtlclwiOjI4fV0sMjc6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1lKFwiLi4vdXRpbHNcIiksaT1lKFwiLi9HZW5lcmljV29ya2VyXCIpO2Z1bmN0aW9uIHMoZSl7aS5jYWxsKHRoaXMsXCJEYXRhV29ya2VyXCIpO3ZhciB0PXRoaXM7dGhpcy5kYXRhSXNSZWFkeT0hMSx0aGlzLmluZGV4PTAsdGhpcy5tYXg9MCx0aGlzLmRhdGE9bnVsbCx0aGlzLnR5cGU9XCJcIix0aGlzLl90aWNrU2NoZWR1bGVkPSExLGUudGhlbihmdW5jdGlvbihlKXt0LmRhdGFJc1JlYWR5PSEwLHQuZGF0YT1lLHQubWF4PWUmJmUubGVuZ3RofHwwLHQudHlwZT1uLmdldFR5cGVPZihlKSx0LmlzUGF1c2VkfHx0Ll90aWNrQW5kUmVwZWF0KCl9LGZ1bmN0aW9uKGUpe3QuZXJyb3IoZSl9KX1uLmluaGVyaXRzKHMsaSkscy5wcm90b3R5cGUuY2xlYW5VcD1mdW5jdGlvbigpe2kucHJvdG90eXBlLmNsZWFuVXAuY2FsbCh0aGlzKSx0aGlzLmRhdGE9bnVsbH0scy5wcm90b3R5cGUucmVzdW1lPWZ1bmN0aW9uKCl7cmV0dXJuISFpLnByb3RvdHlwZS5yZXN1bWUuY2FsbCh0aGlzKSYmKCF0aGlzLl90aWNrU2NoZWR1bGVkJiZ0aGlzLmRhdGFJc1JlYWR5JiYodGhpcy5fdGlja1NjaGVkdWxlZD0hMCxuLmRlbGF5KHRoaXMuX3RpY2tBbmRSZXBlYXQsW10sdGhpcykpLCEwKX0scy5wcm90b3R5cGUuX3RpY2tBbmRSZXBlYXQ9ZnVuY3Rpb24oKXt0aGlzLl90aWNrU2NoZWR1bGVkPSExLHRoaXMuaXNQYXVzZWR8fHRoaXMuaXNGaW5pc2hlZHx8KHRoaXMuX3RpY2soKSx0aGlzLmlzRmluaXNoZWR8fChuLmRlbGF5KHRoaXMuX3RpY2tBbmRSZXBlYXQsW10sdGhpcyksdGhpcy5fdGlja1NjaGVkdWxlZD0hMCkpfSxzLnByb3RvdHlwZS5fdGljaz1mdW5jdGlvbigpe2lmKHRoaXMuaXNQYXVzZWR8fHRoaXMuaXNGaW5pc2hlZClyZXR1cm4hMTt2YXIgZT1udWxsLHQ9TWF0aC5taW4odGhpcy5tYXgsdGhpcy5pbmRleCsxNjM4NCk7aWYodGhpcy5pbmRleD49dGhpcy5tYXgpcmV0dXJuIHRoaXMuZW5kKCk7c3dpdGNoKHRoaXMudHlwZSl7Y2FzZVwic3RyaW5nXCI6ZT10aGlzLmRhdGEuc3Vic3RyaW5nKHRoaXMuaW5kZXgsdCk7YnJlYWs7Y2FzZVwidWludDhhcnJheVwiOmU9dGhpcy5kYXRhLnN1YmFycmF5KHRoaXMuaW5kZXgsdCk7YnJlYWs7Y2FzZVwiYXJyYXlcIjpjYXNlXCJub2RlYnVmZmVyXCI6ZT10aGlzLmRhdGEuc2xpY2UodGhpcy5pbmRleCx0KX1yZXR1cm4gdGhpcy5pbmRleD10LHRoaXMucHVzaCh7ZGF0YTplLG1ldGE6e3BlcmNlbnQ6dGhpcy5tYXg/dGhpcy5pbmRleC90aGlzLm1heCoxMDA6MH19KX0sdC5leHBvcnRzPXN9LHtcIi4uL3V0aWxzXCI6MzIsXCIuL0dlbmVyaWNXb3JrZXJcIjoyOH1dLDI4OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbihlKXt0aGlzLm5hbWU9ZXx8XCJkZWZhdWx0XCIsdGhpcy5zdHJlYW1JbmZvPXt9LHRoaXMuZ2VuZXJhdGVkRXJyb3I9bnVsbCx0aGlzLmV4dHJhU3RyZWFtSW5mbz17fSx0aGlzLmlzUGF1c2VkPSEwLHRoaXMuaXNGaW5pc2hlZD0hMSx0aGlzLmlzTG9ja2VkPSExLHRoaXMuX2xpc3RlbmVycz17ZGF0YTpbXSxlbmQ6W10sZXJyb3I6W119LHRoaXMucHJldmlvdXM9bnVsbH1uLnByb3RvdHlwZT17cHVzaDpmdW5jdGlvbihlKXt0aGlzLmVtaXQoXCJkYXRhXCIsZSl9LGVuZDpmdW5jdGlvbigpe2lmKHRoaXMuaXNGaW5pc2hlZClyZXR1cm4hMTt0aGlzLmZsdXNoKCk7dHJ5e3RoaXMuZW1pdChcImVuZFwiKSx0aGlzLmNsZWFuVXAoKSx0aGlzLmlzRmluaXNoZWQ9ITB9Y2F0Y2goZSl7dGhpcy5lbWl0KFwiZXJyb3JcIixlKX1yZXR1cm4hMH0sZXJyb3I6ZnVuY3Rpb24oZSl7cmV0dXJuIXRoaXMuaXNGaW5pc2hlZCYmKHRoaXMuaXNQYXVzZWQ/dGhpcy5nZW5lcmF0ZWRFcnJvcj1lOih0aGlzLmlzRmluaXNoZWQ9ITAsdGhpcy5lbWl0KFwiZXJyb3JcIixlKSx0aGlzLnByZXZpb3VzJiZ0aGlzLnByZXZpb3VzLmVycm9yKGUpLHRoaXMuY2xlYW5VcCgpKSwhMCl9LG9uOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMuX2xpc3RlbmVyc1tlXS5wdXNoKHQpLHRoaXN9LGNsZWFuVXA6ZnVuY3Rpb24oKXt0aGlzLnN0cmVhbUluZm89dGhpcy5nZW5lcmF0ZWRFcnJvcj10aGlzLmV4dHJhU3RyZWFtSW5mbz1udWxsLHRoaXMuX2xpc3RlbmVycz1bXX0sZW1pdDpmdW5jdGlvbihlLHQpe2lmKHRoaXMuX2xpc3RlbmVyc1tlXSlmb3IodmFyIHI9MDtyPHRoaXMuX2xpc3RlbmVyc1tlXS5sZW5ndGg7cisrKXRoaXMuX2xpc3RlbmVyc1tlXVtyXS5jYWxsKHRoaXMsdCl9LHBpcGU6ZnVuY3Rpb24oZSl7cmV0dXJuIGUucmVnaXN0ZXJQcmV2aW91cyh0aGlzKX0scmVnaXN0ZXJQcmV2aW91czpmdW5jdGlvbihlKXtpZih0aGlzLmlzTG9ja2VkKXRocm93IG5ldyBFcnJvcihcIlRoZSBzdHJlYW0gJ1wiK3RoaXMrXCInIGhhcyBhbHJlYWR5IGJlZW4gdXNlZC5cIik7dGhpcy5zdHJlYW1JbmZvPWUuc3RyZWFtSW5mbyx0aGlzLm1lcmdlU3RyZWFtSW5mbygpLHRoaXMucHJldmlvdXM9ZTt2YXIgdD10aGlzO3JldHVybiBlLm9uKFwiZGF0YVwiLGZ1bmN0aW9uKGUpe3QucHJvY2Vzc0NodW5rKGUpfSksZS5vbihcImVuZFwiLGZ1bmN0aW9uKCl7dC5lbmQoKX0pLGUub24oXCJlcnJvclwiLGZ1bmN0aW9uKGUpe3QuZXJyb3IoZSl9KSx0aGlzfSxwYXVzZTpmdW5jdGlvbigpe3JldHVybiF0aGlzLmlzUGF1c2VkJiYhdGhpcy5pc0ZpbmlzaGVkJiYodGhpcy5pc1BhdXNlZD0hMCx0aGlzLnByZXZpb3VzJiZ0aGlzLnByZXZpb3VzLnBhdXNlKCksITApfSxyZXN1bWU6ZnVuY3Rpb24oKXtpZighdGhpcy5pc1BhdXNlZHx8dGhpcy5pc0ZpbmlzaGVkKXJldHVybiExO3ZhciBlPXRoaXMuaXNQYXVzZWQ9ITE7cmV0dXJuIHRoaXMuZ2VuZXJhdGVkRXJyb3ImJih0aGlzLmVycm9yKHRoaXMuZ2VuZXJhdGVkRXJyb3IpLGU9ITApLHRoaXMucHJldmlvdXMmJnRoaXMucHJldmlvdXMucmVzdW1lKCksIWV9LGZsdXNoOmZ1bmN0aW9uKCl7fSxwcm9jZXNzQ2h1bms6ZnVuY3Rpb24oZSl7dGhpcy5wdXNoKGUpfSx3aXRoU3RyZWFtSW5mbzpmdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLmV4dHJhU3RyZWFtSW5mb1tlXT10LHRoaXMubWVyZ2VTdHJlYW1JbmZvKCksdGhpc30sbWVyZ2VTdHJlYW1JbmZvOmZ1bmN0aW9uKCl7Zm9yKHZhciBlIGluIHRoaXMuZXh0cmFTdHJlYW1JbmZvKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLmV4dHJhU3RyZWFtSW5mbyxlKSYmKHRoaXMuc3RyZWFtSW5mb1tlXT10aGlzLmV4dHJhU3RyZWFtSW5mb1tlXSl9LGxvY2s6ZnVuY3Rpb24oKXtpZih0aGlzLmlzTG9ja2VkKXRocm93IG5ldyBFcnJvcihcIlRoZSBzdHJlYW0gJ1wiK3RoaXMrXCInIGhhcyBhbHJlYWR5IGJlZW4gdXNlZC5cIik7dGhpcy5pc0xvY2tlZD0hMCx0aGlzLnByZXZpb3VzJiZ0aGlzLnByZXZpb3VzLmxvY2soKX0sdG9TdHJpbmc6ZnVuY3Rpb24oKXt2YXIgZT1cIldvcmtlciBcIit0aGlzLm5hbWU7cmV0dXJuIHRoaXMucHJldmlvdXM/dGhpcy5wcmV2aW91cytcIiAtPiBcIitlOmV9fSx0LmV4cG9ydHM9bn0se31dLDI5OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIGg9ZShcIi4uL3V0aWxzXCIpLGk9ZShcIi4vQ29udmVydFdvcmtlclwiKSxzPWUoXCIuL0dlbmVyaWNXb3JrZXJcIiksdT1lKFwiLi4vYmFzZTY0XCIpLG49ZShcIi4uL3N1cHBvcnRcIiksYT1lKFwiLi4vZXh0ZXJuYWxcIiksbz1udWxsO2lmKG4ubm9kZXN0cmVhbSl0cnl7bz1lKFwiLi4vbm9kZWpzL05vZGVqc1N0cmVhbU91dHB1dEFkYXB0ZXJcIil9Y2F0Y2goZSl7fWZ1bmN0aW9uIGwoZSxvKXtyZXR1cm4gbmV3IGEuUHJvbWlzZShmdW5jdGlvbih0LHIpe3ZhciBuPVtdLGk9ZS5faW50ZXJuYWxUeXBlLHM9ZS5fb3V0cHV0VHlwZSxhPWUuX21pbWVUeXBlO2Uub24oXCJkYXRhXCIsZnVuY3Rpb24oZSx0KXtuLnB1c2goZSksbyYmbyh0KX0pLm9uKFwiZXJyb3JcIixmdW5jdGlvbihlKXtuPVtdLHIoZSl9KS5vbihcImVuZFwiLGZ1bmN0aW9uKCl7dHJ5e3ZhciBlPWZ1bmN0aW9uKGUsdCxyKXtzd2l0Y2goZSl7Y2FzZVwiYmxvYlwiOnJldHVybiBoLm5ld0Jsb2IoaC50cmFuc2Zvcm1UbyhcImFycmF5YnVmZmVyXCIsdCkscik7Y2FzZVwiYmFzZTY0XCI6cmV0dXJuIHUuZW5jb2RlKHQpO2RlZmF1bHQ6cmV0dXJuIGgudHJhbnNmb3JtVG8oZSx0KX19KHMsZnVuY3Rpb24oZSx0KXt2YXIgcixuPTAsaT1udWxsLHM9MDtmb3Iocj0wO3I8dC5sZW5ndGg7cisrKXMrPXRbcl0ubGVuZ3RoO3N3aXRjaChlKXtjYXNlXCJzdHJpbmdcIjpyZXR1cm4gdC5qb2luKFwiXCIpO2Nhc2VcImFycmF5XCI6cmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQuYXBwbHkoW10sdCk7Y2FzZVwidWludDhhcnJheVwiOmZvcihpPW5ldyBVaW50OEFycmF5KHMpLHI9MDtyPHQubGVuZ3RoO3IrKylpLnNldCh0W3JdLG4pLG4rPXRbcl0ubGVuZ3RoO3JldHVybiBpO2Nhc2VcIm5vZGVidWZmZXJcIjpyZXR1cm4gQnVmZmVyLmNvbmNhdCh0KTtkZWZhdWx0OnRocm93IG5ldyBFcnJvcihcImNvbmNhdCA6IHVuc3VwcG9ydGVkIHR5cGUgJ1wiK2UrXCInXCIpfX0oaSxuKSxhKTt0KGUpfWNhdGNoKGUpe3IoZSl9bj1bXX0pLnJlc3VtZSgpfSl9ZnVuY3Rpb24gZihlLHQscil7dmFyIG49dDtzd2l0Y2godCl7Y2FzZVwiYmxvYlwiOmNhc2VcImFycmF5YnVmZmVyXCI6bj1cInVpbnQ4YXJyYXlcIjticmVhaztjYXNlXCJiYXNlNjRcIjpuPVwic3RyaW5nXCJ9dHJ5e3RoaXMuX2ludGVybmFsVHlwZT1uLHRoaXMuX291dHB1dFR5cGU9dCx0aGlzLl9taW1lVHlwZT1yLGguY2hlY2tTdXBwb3J0KG4pLHRoaXMuX3dvcmtlcj1lLnBpcGUobmV3IGkobikpLGUubG9jaygpfWNhdGNoKGUpe3RoaXMuX3dvcmtlcj1uZXcgcyhcImVycm9yXCIpLHRoaXMuX3dvcmtlci5lcnJvcihlKX19Zi5wcm90b3R5cGU9e2FjY3VtdWxhdGU6ZnVuY3Rpb24oZSl7cmV0dXJuIGwodGhpcyxlKX0sb246ZnVuY3Rpb24oZSx0KXt2YXIgcj10aGlzO3JldHVyblwiZGF0YVwiPT09ZT90aGlzLl93b3JrZXIub24oZSxmdW5jdGlvbihlKXt0LmNhbGwocixlLmRhdGEsZS5tZXRhKX0pOnRoaXMuX3dvcmtlci5vbihlLGZ1bmN0aW9uKCl7aC5kZWxheSh0LGFyZ3VtZW50cyxyKX0pLHRoaXN9LHJlc3VtZTpmdW5jdGlvbigpe3JldHVybiBoLmRlbGF5KHRoaXMuX3dvcmtlci5yZXN1bWUsW10sdGhpcy5fd29ya2VyKSx0aGlzfSxwYXVzZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLl93b3JrZXIucGF1c2UoKSx0aGlzfSx0b05vZGVqc1N0cmVhbTpmdW5jdGlvbihlKXtpZihoLmNoZWNrU3VwcG9ydChcIm5vZGVzdHJlYW1cIiksXCJub2RlYnVmZmVyXCIhPT10aGlzLl9vdXRwdXRUeXBlKXRocm93IG5ldyBFcnJvcih0aGlzLl9vdXRwdXRUeXBlK1wiIGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhpcyBtZXRob2RcIik7cmV0dXJuIG5ldyBvKHRoaXMse29iamVjdE1vZGU6XCJub2RlYnVmZmVyXCIhPT10aGlzLl9vdXRwdXRUeXBlfSxlKX19LHQuZXhwb3J0cz1mfSx7XCIuLi9iYXNlNjRcIjoxLFwiLi4vZXh0ZXJuYWxcIjo2LFwiLi4vbm9kZWpzL05vZGVqc1N0cmVhbU91dHB1dEFkYXB0ZXJcIjoxMyxcIi4uL3N1cHBvcnRcIjozMCxcIi4uL3V0aWxzXCI6MzIsXCIuL0NvbnZlcnRXb3JrZXJcIjoyNCxcIi4vR2VuZXJpY1dvcmtlclwiOjI4fV0sMzA6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjtpZihyLmJhc2U2ND0hMCxyLmFycmF5PSEwLHIuc3RyaW5nPSEwLHIuYXJyYXlidWZmZXI9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIEFycmF5QnVmZmVyJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgVWludDhBcnJheSxyLm5vZGVidWZmZXI9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIEJ1ZmZlcixyLnVpbnQ4YXJyYXk9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFVpbnQ4QXJyYXksXCJ1bmRlZmluZWRcIj09dHlwZW9mIEFycmF5QnVmZmVyKXIuYmxvYj0hMTtlbHNle3ZhciBuPW5ldyBBcnJheUJ1ZmZlcigwKTt0cnl7ci5ibG9iPTA9PT1uZXcgQmxvYihbbl0se3R5cGU6XCJhcHBsaWNhdGlvbi96aXBcIn0pLnNpemV9Y2F0Y2goZSl7dHJ5e3ZhciBpPW5ldyhzZWxmLkJsb2JCdWlsZGVyfHxzZWxmLldlYktpdEJsb2JCdWlsZGVyfHxzZWxmLk1vekJsb2JCdWlsZGVyfHxzZWxmLk1TQmxvYkJ1aWxkZXIpO2kuYXBwZW5kKG4pLHIuYmxvYj0wPT09aS5nZXRCbG9iKFwiYXBwbGljYXRpb24vemlwXCIpLnNpemV9Y2F0Y2goZSl7ci5ibG9iPSExfX19dHJ5e3Iubm9kZXN0cmVhbT0hIWUoXCJyZWFkYWJsZS1zdHJlYW1cIikuUmVhZGFibGV9Y2F0Y2goZSl7ci5ub2Rlc3RyZWFtPSExfX0se1wicmVhZGFibGUtc3RyZWFtXCI6MTZ9XSwzMTpbZnVuY3Rpb24oZSx0LHMpe1widXNlIHN0cmljdFwiO2Zvcih2YXIgbz1lKFwiLi91dGlsc1wiKSxoPWUoXCIuL3N1cHBvcnRcIikscj1lKFwiLi9ub2RlanNVdGlsc1wiKSxuPWUoXCIuL3N0cmVhbS9HZW5lcmljV29ya2VyXCIpLHU9bmV3IEFycmF5KDI1NiksaT0wO2k8MjU2O2krKyl1W2ldPTI1Mjw9aT82OjI0ODw9aT81OjI0MDw9aT80OjIyNDw9aT8zOjE5Mjw9aT8yOjE7dVsyNTRdPXVbMjU0XT0xO2Z1bmN0aW9uIGEoKXtuLmNhbGwodGhpcyxcInV0Zi04IGRlY29kZVwiKSx0aGlzLmxlZnRPdmVyPW51bGx9ZnVuY3Rpb24gbCgpe24uY2FsbCh0aGlzLFwidXRmLTggZW5jb2RlXCIpfXMudXRmOGVuY29kZT1mdW5jdGlvbihlKXtyZXR1cm4gaC5ub2RlYnVmZmVyP3IubmV3QnVmZmVyRnJvbShlLFwidXRmLThcIik6ZnVuY3Rpb24oZSl7dmFyIHQscixuLGkscyxhPWUubGVuZ3RoLG89MDtmb3IoaT0wO2k8YTtpKyspNTUyOTY9PSg2NDUxMiYocj1lLmNoYXJDb2RlQXQoaSkpKSYmaSsxPGEmJjU2MzIwPT0oNjQ1MTImKG49ZS5jaGFyQ29kZUF0KGkrMSkpKSYmKHI9NjU1MzYrKHItNTUyOTY8PDEwKSsobi01NjMyMCksaSsrKSxvKz1yPDEyOD8xOnI8MjA0OD8yOnI8NjU1MzY/Mzo0O2Zvcih0PWgudWludDhhcnJheT9uZXcgVWludDhBcnJheShvKTpuZXcgQXJyYXkobyksaT1zPTA7czxvO2krKyk1NTI5Nj09KDY0NTEyJihyPWUuY2hhckNvZGVBdChpKSkpJiZpKzE8YSYmNTYzMjA9PSg2NDUxMiYobj1lLmNoYXJDb2RlQXQoaSsxKSkpJiYocj02NTUzNisoci01NTI5Njw8MTApKyhuLTU2MzIwKSxpKyspLHI8MTI4P3RbcysrXT1yOihyPDIwNDg/dFtzKytdPTE5MnxyPj4+Njoocjw2NTUzNj90W3MrK109MjI0fHI+Pj4xMjoodFtzKytdPTI0MHxyPj4+MTgsdFtzKytdPTEyOHxyPj4+MTImNjMpLHRbcysrXT0xMjh8cj4+PjYmNjMpLHRbcysrXT0xMjh8NjMmcik7cmV0dXJuIHR9KGUpfSxzLnV0ZjhkZWNvZGU9ZnVuY3Rpb24oZSl7cmV0dXJuIGgubm9kZWJ1ZmZlcj9vLnRyYW5zZm9ybVRvKFwibm9kZWJ1ZmZlclwiLGUpLnRvU3RyaW5nKFwidXRmLThcIik6ZnVuY3Rpb24oZSl7dmFyIHQscixuLGkscz1lLmxlbmd0aCxhPW5ldyBBcnJheSgyKnMpO2Zvcih0PXI9MDt0PHM7KWlmKChuPWVbdCsrXSk8MTI4KWFbcisrXT1uO2Vsc2UgaWYoNDwoaT11W25dKSlhW3IrK109NjU1MzMsdCs9aS0xO2Vsc2V7Zm9yKG4mPTI9PT1pPzMxOjM9PT1pPzE1Ojc7MTxpJiZ0PHM7KW49bjw8Nnw2MyZlW3QrK10saS0tOzE8aT9hW3IrK109NjU1MzM6bjw2NTUzNj9hW3IrK109bjoobi09NjU1MzYsYVtyKytdPTU1Mjk2fG4+PjEwJjEwMjMsYVtyKytdPTU2MzIwfDEwMjMmbil9cmV0dXJuIGEubGVuZ3RoIT09ciYmKGEuc3ViYXJyYXk/YT1hLnN1YmFycmF5KDAscik6YS5sZW5ndGg9ciksby5hcHBseUZyb21DaGFyQ29kZShhKX0oZT1vLnRyYW5zZm9ybVRvKGgudWludDhhcnJheT9cInVpbnQ4YXJyYXlcIjpcImFycmF5XCIsZSkpfSxvLmluaGVyaXRzKGEsbiksYS5wcm90b3R5cGUucHJvY2Vzc0NodW5rPWZ1bmN0aW9uKGUpe3ZhciB0PW8udHJhbnNmb3JtVG8oaC51aW50OGFycmF5P1widWludDhhcnJheVwiOlwiYXJyYXlcIixlLmRhdGEpO2lmKHRoaXMubGVmdE92ZXImJnRoaXMubGVmdE92ZXIubGVuZ3RoKXtpZihoLnVpbnQ4YXJyYXkpe3ZhciByPXQ7KHQ9bmV3IFVpbnQ4QXJyYXkoci5sZW5ndGgrdGhpcy5sZWZ0T3Zlci5sZW5ndGgpKS5zZXQodGhpcy5sZWZ0T3ZlciwwKSx0LnNldChyLHRoaXMubGVmdE92ZXIubGVuZ3RoKX1lbHNlIHQ9dGhpcy5sZWZ0T3Zlci5jb25jYXQodCk7dGhpcy5sZWZ0T3Zlcj1udWxsfXZhciBuPWZ1bmN0aW9uKGUsdCl7dmFyIHI7Zm9yKCh0PXR8fGUubGVuZ3RoKT5lLmxlbmd0aCYmKHQ9ZS5sZW5ndGgpLHI9dC0xOzA8PXImJjEyOD09KDE5MiZlW3JdKTspci0tO3JldHVybiByPDA/dDowPT09cj90OnIrdVtlW3JdXT50P3I6dH0odCksaT10O24hPT10Lmxlbmd0aCYmKGgudWludDhhcnJheT8oaT10LnN1YmFycmF5KDAsbiksdGhpcy5sZWZ0T3Zlcj10LnN1YmFycmF5KG4sdC5sZW5ndGgpKTooaT10LnNsaWNlKDAsbiksdGhpcy5sZWZ0T3Zlcj10LnNsaWNlKG4sdC5sZW5ndGgpKSksdGhpcy5wdXNoKHtkYXRhOnMudXRmOGRlY29kZShpKSxtZXRhOmUubWV0YX0pfSxhLnByb3RvdHlwZS5mbHVzaD1mdW5jdGlvbigpe3RoaXMubGVmdE92ZXImJnRoaXMubGVmdE92ZXIubGVuZ3RoJiYodGhpcy5wdXNoKHtkYXRhOnMudXRmOGRlY29kZSh0aGlzLmxlZnRPdmVyKSxtZXRhOnt9fSksdGhpcy5sZWZ0T3Zlcj1udWxsKX0scy5VdGY4RGVjb2RlV29ya2VyPWEsby5pbmhlcml0cyhsLG4pLGwucHJvdG90eXBlLnByb2Nlc3NDaHVuaz1mdW5jdGlvbihlKXt0aGlzLnB1c2goe2RhdGE6cy51dGY4ZW5jb2RlKGUuZGF0YSksbWV0YTplLm1ldGF9KX0scy5VdGY4RW5jb2RlV29ya2VyPWx9LHtcIi4vbm9kZWpzVXRpbHNcIjoxNCxcIi4vc3RyZWFtL0dlbmVyaWNXb3JrZXJcIjoyOCxcIi4vc3VwcG9ydFwiOjMwLFwiLi91dGlsc1wiOjMyfV0sMzI6W2Z1bmN0aW9uKGUsdCxhKXtcInVzZSBzdHJpY3RcIjt2YXIgbz1lKFwiLi9zdXBwb3J0XCIpLGg9ZShcIi4vYmFzZTY0XCIpLHI9ZShcIi4vbm9kZWpzVXRpbHNcIiksdT1lKFwiLi9leHRlcm5hbFwiKTtmdW5jdGlvbiBuKGUpe3JldHVybiBlfWZ1bmN0aW9uIGwoZSx0KXtmb3IodmFyIHI9MDtyPGUubGVuZ3RoOysrcil0W3JdPTI1NSZlLmNoYXJDb2RlQXQocik7cmV0dXJuIHR9ZShcInNldGltbWVkaWF0ZVwiKSxhLm5ld0Jsb2I9ZnVuY3Rpb24odCxyKXthLmNoZWNrU3VwcG9ydChcImJsb2JcIik7dHJ5e3JldHVybiBuZXcgQmxvYihbdF0se3R5cGU6cn0pfWNhdGNoKGUpe3RyeXt2YXIgbj1uZXcoc2VsZi5CbG9iQnVpbGRlcnx8c2VsZi5XZWJLaXRCbG9iQnVpbGRlcnx8c2VsZi5Nb3pCbG9iQnVpbGRlcnx8c2VsZi5NU0Jsb2JCdWlsZGVyKTtyZXR1cm4gbi5hcHBlbmQodCksbi5nZXRCbG9iKHIpfWNhdGNoKGUpe3Rocm93IG5ldyBFcnJvcihcIkJ1ZyA6IGNhbid0IGNvbnN0cnVjdCB0aGUgQmxvYi5cIil9fX07dmFyIGk9e3N0cmluZ2lmeUJ5Q2h1bms6ZnVuY3Rpb24oZSx0LHIpe3ZhciBuPVtdLGk9MCxzPWUubGVuZ3RoO2lmKHM8PXIpcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxlKTtmb3IoO2k8czspXCJhcnJheVwiPT09dHx8XCJub2RlYnVmZmVyXCI9PT10P24ucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsZS5zbGljZShpLE1hdGgubWluKGkrcixzKSkpKTpuLnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLGUuc3ViYXJyYXkoaSxNYXRoLm1pbihpK3IscykpKSksaSs9cjtyZXR1cm4gbi5qb2luKFwiXCIpfSxzdHJpbmdpZnlCeUNoYXI6ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PVwiXCIscj0wO3I8ZS5sZW5ndGg7cisrKXQrPVN0cmluZy5mcm9tQ2hhckNvZGUoZVtyXSk7cmV0dXJuIHR9LGFwcGx5Q2FuQmVVc2VkOnt1aW50OGFycmF5OmZ1bmN0aW9uKCl7dHJ5e3JldHVybiBvLnVpbnQ4YXJyYXkmJjE9PT1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsbmV3IFVpbnQ4QXJyYXkoMSkpLmxlbmd0aH1jYXRjaChlKXtyZXR1cm4hMX19KCksbm9kZWJ1ZmZlcjpmdW5jdGlvbigpe3RyeXtyZXR1cm4gby5ub2RlYnVmZmVyJiYxPT09U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLHIuYWxsb2NCdWZmZXIoMSkpLmxlbmd0aH1jYXRjaChlKXtyZXR1cm4hMX19KCl9fTtmdW5jdGlvbiBzKGUpe3ZhciB0PTY1NTM2LHI9YS5nZXRUeXBlT2YoZSksbj0hMDtpZihcInVpbnQ4YXJyYXlcIj09PXI/bj1pLmFwcGx5Q2FuQmVVc2VkLnVpbnQ4YXJyYXk6XCJub2RlYnVmZmVyXCI9PT1yJiYobj1pLmFwcGx5Q2FuQmVVc2VkLm5vZGVidWZmZXIpLG4pZm9yKDsxPHQ7KXRyeXtyZXR1cm4gaS5zdHJpbmdpZnlCeUNodW5rKGUscix0KX1jYXRjaChlKXt0PU1hdGguZmxvb3IodC8yKX1yZXR1cm4gaS5zdHJpbmdpZnlCeUNoYXIoZSl9ZnVuY3Rpb24gZihlLHQpe2Zvcih2YXIgcj0wO3I8ZS5sZW5ndGg7cisrKXRbcl09ZVtyXTtyZXR1cm4gdH1hLmFwcGx5RnJvbUNoYXJDb2RlPXM7dmFyIGM9e307Yy5zdHJpbmc9e3N0cmluZzpuLGFycmF5OmZ1bmN0aW9uKGUpe3JldHVybiBsKGUsbmV3IEFycmF5KGUubGVuZ3RoKSl9LGFycmF5YnVmZmVyOmZ1bmN0aW9uKGUpe3JldHVybiBjLnN0cmluZy51aW50OGFycmF5KGUpLmJ1ZmZlcn0sdWludDhhcnJheTpmdW5jdGlvbihlKXtyZXR1cm4gbChlLG5ldyBVaW50OEFycmF5KGUubGVuZ3RoKSl9LG5vZGVidWZmZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGwoZSxyLmFsbG9jQnVmZmVyKGUubGVuZ3RoKSl9fSxjLmFycmF5PXtzdHJpbmc6cyxhcnJheTpuLGFycmF5YnVmZmVyOmZ1bmN0aW9uKGUpe3JldHVybiBuZXcgVWludDhBcnJheShlKS5idWZmZXJ9LHVpbnQ4YXJyYXk6ZnVuY3Rpb24oZSl7cmV0dXJuIG5ldyBVaW50OEFycmF5KGUpfSxub2RlYnVmZmVyOmZ1bmN0aW9uKGUpe3JldHVybiByLm5ld0J1ZmZlckZyb20oZSl9fSxjLmFycmF5YnVmZmVyPXtzdHJpbmc6ZnVuY3Rpb24oZSl7cmV0dXJuIHMobmV3IFVpbnQ4QXJyYXkoZSkpfSxhcnJheTpmdW5jdGlvbihlKXtyZXR1cm4gZihuZXcgVWludDhBcnJheShlKSxuZXcgQXJyYXkoZS5ieXRlTGVuZ3RoKSl9LGFycmF5YnVmZmVyOm4sdWludDhhcnJheTpmdW5jdGlvbihlKXtyZXR1cm4gbmV3IFVpbnQ4QXJyYXkoZSl9LG5vZGVidWZmZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIHIubmV3QnVmZmVyRnJvbShuZXcgVWludDhBcnJheShlKSl9fSxjLnVpbnQ4YXJyYXk9e3N0cmluZzpzLGFycmF5OmZ1bmN0aW9uKGUpe3JldHVybiBmKGUsbmV3IEFycmF5KGUubGVuZ3RoKSl9LGFycmF5YnVmZmVyOmZ1bmN0aW9uKGUpe3JldHVybiBlLmJ1ZmZlcn0sdWludDhhcnJheTpuLG5vZGVidWZmZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIHIubmV3QnVmZmVyRnJvbShlKX19LGMubm9kZWJ1ZmZlcj17c3RyaW5nOnMsYXJyYXk6ZnVuY3Rpb24oZSl7cmV0dXJuIGYoZSxuZXcgQXJyYXkoZS5sZW5ndGgpKX0sYXJyYXlidWZmZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGMubm9kZWJ1ZmZlci51aW50OGFycmF5KGUpLmJ1ZmZlcn0sdWludDhhcnJheTpmdW5jdGlvbihlKXtyZXR1cm4gZihlLG5ldyBVaW50OEFycmF5KGUubGVuZ3RoKSl9LG5vZGVidWZmZXI6bn0sYS50cmFuc2Zvcm1Ubz1mdW5jdGlvbihlLHQpe2lmKHQ9dHx8XCJcIiwhZSlyZXR1cm4gdDthLmNoZWNrU3VwcG9ydChlKTt2YXIgcj1hLmdldFR5cGVPZih0KTtyZXR1cm4gY1tyXVtlXSh0KX0sYS5yZXNvbHZlPWZ1bmN0aW9uKGUpe2Zvcih2YXIgdD1lLnNwbGl0KFwiL1wiKSxyPVtdLG49MDtuPHQubGVuZ3RoO24rKyl7dmFyIGk9dFtuXTtcIi5cIj09PWl8fFwiXCI9PT1pJiYwIT09biYmbiE9PXQubGVuZ3RoLTF8fChcIi4uXCI9PT1pP3IucG9wKCk6ci5wdXNoKGkpKX1yZXR1cm4gci5qb2luKFwiL1wiKX0sYS5nZXRUeXBlT2Y9ZnVuY3Rpb24oZSl7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIGU/XCJzdHJpbmdcIjpcIltvYmplY3QgQXJyYXldXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZSk/XCJhcnJheVwiOm8ubm9kZWJ1ZmZlciYmci5pc0J1ZmZlcihlKT9cIm5vZGVidWZmZXJcIjpvLnVpbnQ4YXJyYXkmJmUgaW5zdGFuY2VvZiBVaW50OEFycmF5P1widWludDhhcnJheVwiOm8uYXJyYXlidWZmZXImJmUgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcj9cImFycmF5YnVmZmVyXCI6dm9pZCAwfSxhLmNoZWNrU3VwcG9ydD1mdW5jdGlvbihlKXtpZighb1tlLnRvTG93ZXJDYXNlKCldKXRocm93IG5ldyBFcnJvcihlK1wiIGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhpcyBwbGF0Zm9ybVwiKX0sYS5NQVhfVkFMVUVfMTZCSVRTPTY1NTM1LGEuTUFYX1ZBTFVFXzMyQklUUz0tMSxhLnByZXR0eT1mdW5jdGlvbihlKXt2YXIgdCxyLG49XCJcIjtmb3Iocj0wO3I8KGV8fFwiXCIpLmxlbmd0aDtyKyspbis9XCJcXFxceFwiKygodD1lLmNoYXJDb2RlQXQocikpPDE2P1wiMFwiOlwiXCIpK3QudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7cmV0dXJuIG59LGEuZGVsYXk9ZnVuY3Rpb24oZSx0LHIpe3NldEltbWVkaWF0ZShmdW5jdGlvbigpe2UuYXBwbHkocnx8bnVsbCx0fHxbXSl9KX0sYS5pbmhlcml0cz1mdW5jdGlvbihlLHQpe2Z1bmN0aW9uIHIoKXt9ci5wcm90b3R5cGU9dC5wcm90b3R5cGUsZS5wcm90b3R5cGU9bmV3IHJ9LGEuZXh0ZW5kPWZ1bmN0aW9uKCl7dmFyIGUsdCxyPXt9O2ZvcihlPTA7ZTxhcmd1bWVudHMubGVuZ3RoO2UrKylmb3IodCBpbiBhcmd1bWVudHNbZV0pT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFyZ3VtZW50c1tlXSx0KSYmdm9pZCAwPT09clt0XSYmKHJbdF09YXJndW1lbnRzW2VdW3RdKTtyZXR1cm4gcn0sYS5wcmVwYXJlQ29udGVudD1mdW5jdGlvbihyLGUsbixpLHMpe3JldHVybiB1LlByb21pc2UucmVzb2x2ZShlKS50aGVuKGZ1bmN0aW9uKG4pe3JldHVybiBvLmJsb2ImJihuIGluc3RhbmNlb2YgQmxvYnx8LTEhPT1bXCJbb2JqZWN0IEZpbGVdXCIsXCJbb2JqZWN0IEJsb2JdXCJdLmluZGV4T2YoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG4pKSkmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBGaWxlUmVhZGVyP25ldyB1LlByb21pc2UoZnVuY3Rpb24odCxyKXt2YXIgZT1uZXcgRmlsZVJlYWRlcjtlLm9ubG9hZD1mdW5jdGlvbihlKXt0KGUudGFyZ2V0LnJlc3VsdCl9LGUub25lcnJvcj1mdW5jdGlvbihlKXtyKGUudGFyZ2V0LmVycm9yKX0sZS5yZWFkQXNBcnJheUJ1ZmZlcihuKX0pOm59KS50aGVuKGZ1bmN0aW9uKGUpe3ZhciB0PWEuZ2V0VHlwZU9mKGUpO3JldHVybiB0PyhcImFycmF5YnVmZmVyXCI9PT10P2U9YS50cmFuc2Zvcm1UbyhcInVpbnQ4YXJyYXlcIixlKTpcInN0cmluZ1wiPT09dCYmKHM/ZT1oLmRlY29kZShlKTpuJiYhMCE9PWkmJihlPWZ1bmN0aW9uKGUpe3JldHVybiBsKGUsby51aW50OGFycmF5P25ldyBVaW50OEFycmF5KGUubGVuZ3RoKTpuZXcgQXJyYXkoZS5sZW5ndGgpKX0oZSkpKSxlKTp1LlByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbid0IHJlYWQgdGhlIGRhdGEgb2YgJ1wiK3IrXCInLiBJcyBpdCBpbiBhIHN1cHBvcnRlZCBKYXZhU2NyaXB0IHR5cGUgKFN0cmluZywgQmxvYiwgQXJyYXlCdWZmZXIsIGV0YykgP1wiKSl9KX19LHtcIi4vYmFzZTY0XCI6MSxcIi4vZXh0ZXJuYWxcIjo2LFwiLi9ub2RlanNVdGlsc1wiOjE0LFwiLi9zdXBwb3J0XCI6MzAsc2V0aW1tZWRpYXRlOjU0fV0sMzM6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1lKFwiLi9yZWFkZXIvcmVhZGVyRm9yXCIpLGk9ZShcIi4vdXRpbHNcIikscz1lKFwiLi9zaWduYXR1cmVcIiksYT1lKFwiLi96aXBFbnRyeVwiKSxvPWUoXCIuL3N1cHBvcnRcIik7ZnVuY3Rpb24gaChlKXt0aGlzLmZpbGVzPVtdLHRoaXMubG9hZE9wdGlvbnM9ZX1oLnByb3RvdHlwZT17Y2hlY2tTaWduYXR1cmU6ZnVuY3Rpb24oZSl7aWYoIXRoaXMucmVhZGVyLnJlYWRBbmRDaGVja1NpZ25hdHVyZShlKSl7dGhpcy5yZWFkZXIuaW5kZXgtPTQ7dmFyIHQ9dGhpcy5yZWFkZXIucmVhZFN0cmluZyg0KTt0aHJvdyBuZXcgRXJyb3IoXCJDb3JydXB0ZWQgemlwIG9yIGJ1ZzogdW5leHBlY3RlZCBzaWduYXR1cmUgKFwiK2kucHJldHR5KHQpK1wiLCBleHBlY3RlZCBcIitpLnByZXR0eShlKStcIilcIil9fSxpc1NpZ25hdHVyZTpmdW5jdGlvbihlLHQpe3ZhciByPXRoaXMucmVhZGVyLmluZGV4O3RoaXMucmVhZGVyLnNldEluZGV4KGUpO3ZhciBuPXRoaXMucmVhZGVyLnJlYWRTdHJpbmcoNCk9PT10O3JldHVybiB0aGlzLnJlYWRlci5zZXRJbmRleChyKSxufSxyZWFkQmxvY2tFbmRPZkNlbnRyYWw6ZnVuY3Rpb24oKXt0aGlzLmRpc2tOdW1iZXI9dGhpcy5yZWFkZXIucmVhZEludCgyKSx0aGlzLmRpc2tXaXRoQ2VudHJhbERpclN0YXJ0PXRoaXMucmVhZGVyLnJlYWRJbnQoMiksdGhpcy5jZW50cmFsRGlyUmVjb3Jkc09uVGhpc0Rpc2s9dGhpcy5yZWFkZXIucmVhZEludCgyKSx0aGlzLmNlbnRyYWxEaXJSZWNvcmRzPXRoaXMucmVhZGVyLnJlYWRJbnQoMiksdGhpcy5jZW50cmFsRGlyU2l6ZT10aGlzLnJlYWRlci5yZWFkSW50KDQpLHRoaXMuY2VudHJhbERpck9mZnNldD10aGlzLnJlYWRlci5yZWFkSW50KDQpLHRoaXMuemlwQ29tbWVudExlbmd0aD10aGlzLnJlYWRlci5yZWFkSW50KDIpO3ZhciBlPXRoaXMucmVhZGVyLnJlYWREYXRhKHRoaXMuemlwQ29tbWVudExlbmd0aCksdD1vLnVpbnQ4YXJyYXk/XCJ1aW50OGFycmF5XCI6XCJhcnJheVwiLHI9aS50cmFuc2Zvcm1Ubyh0LGUpO3RoaXMuemlwQ29tbWVudD10aGlzLmxvYWRPcHRpb25zLmRlY29kZUZpbGVOYW1lKHIpfSxyZWFkQmxvY2taaXA2NEVuZE9mQ2VudHJhbDpmdW5jdGlvbigpe3RoaXMuemlwNjRFbmRPZkNlbnRyYWxTaXplPXRoaXMucmVhZGVyLnJlYWRJbnQoOCksdGhpcy5yZWFkZXIuc2tpcCg0KSx0aGlzLmRpc2tOdW1iZXI9dGhpcy5yZWFkZXIucmVhZEludCg0KSx0aGlzLmRpc2tXaXRoQ2VudHJhbERpclN0YXJ0PXRoaXMucmVhZGVyLnJlYWRJbnQoNCksdGhpcy5jZW50cmFsRGlyUmVjb3Jkc09uVGhpc0Rpc2s9dGhpcy5yZWFkZXIucmVhZEludCg4KSx0aGlzLmNlbnRyYWxEaXJSZWNvcmRzPXRoaXMucmVhZGVyLnJlYWRJbnQoOCksdGhpcy5jZW50cmFsRGlyU2l6ZT10aGlzLnJlYWRlci5yZWFkSW50KDgpLHRoaXMuY2VudHJhbERpck9mZnNldD10aGlzLnJlYWRlci5yZWFkSW50KDgpLHRoaXMuemlwNjRFeHRlbnNpYmxlRGF0YT17fTtmb3IodmFyIGUsdCxyLG49dGhpcy56aXA2NEVuZE9mQ2VudHJhbFNpemUtNDQ7MDxuOyllPXRoaXMucmVhZGVyLnJlYWRJbnQoMiksdD10aGlzLnJlYWRlci5yZWFkSW50KDQpLHI9dGhpcy5yZWFkZXIucmVhZERhdGEodCksdGhpcy56aXA2NEV4dGVuc2libGVEYXRhW2VdPXtpZDplLGxlbmd0aDp0LHZhbHVlOnJ9fSxyZWFkQmxvY2taaXA2NEVuZE9mQ2VudHJhbExvY2F0b3I6ZnVuY3Rpb24oKXtpZih0aGlzLmRpc2tXaXRoWmlwNjRDZW50cmFsRGlyU3RhcnQ9dGhpcy5yZWFkZXIucmVhZEludCg0KSx0aGlzLnJlbGF0aXZlT2Zmc2V0RW5kT2ZaaXA2NENlbnRyYWxEaXI9dGhpcy5yZWFkZXIucmVhZEludCg4KSx0aGlzLmRpc2tzQ291bnQ9dGhpcy5yZWFkZXIucmVhZEludCg0KSwxPHRoaXMuZGlza3NDb3VudCl0aHJvdyBuZXcgRXJyb3IoXCJNdWx0aS12b2x1bWVzIHppcCBhcmUgbm90IHN1cHBvcnRlZFwiKX0scmVhZExvY2FsRmlsZXM6ZnVuY3Rpb24oKXt2YXIgZSx0O2ZvcihlPTA7ZTx0aGlzLmZpbGVzLmxlbmd0aDtlKyspdD10aGlzLmZpbGVzW2VdLHRoaXMucmVhZGVyLnNldEluZGV4KHQubG9jYWxIZWFkZXJPZmZzZXQpLHRoaXMuY2hlY2tTaWduYXR1cmUocy5MT0NBTF9GSUxFX0hFQURFUiksdC5yZWFkTG9jYWxQYXJ0KHRoaXMucmVhZGVyKSx0LmhhbmRsZVVURjgoKSx0LnByb2Nlc3NBdHRyaWJ1dGVzKCl9LHJlYWRDZW50cmFsRGlyOmZ1bmN0aW9uKCl7dmFyIGU7Zm9yKHRoaXMucmVhZGVyLnNldEluZGV4KHRoaXMuY2VudHJhbERpck9mZnNldCk7dGhpcy5yZWFkZXIucmVhZEFuZENoZWNrU2lnbmF0dXJlKHMuQ0VOVFJBTF9GSUxFX0hFQURFUik7KShlPW5ldyBhKHt6aXA2NDp0aGlzLnppcDY0fSx0aGlzLmxvYWRPcHRpb25zKSkucmVhZENlbnRyYWxQYXJ0KHRoaXMucmVhZGVyKSx0aGlzLmZpbGVzLnB1c2goZSk7aWYodGhpcy5jZW50cmFsRGlyUmVjb3JkcyE9PXRoaXMuZmlsZXMubGVuZ3RoJiYwIT09dGhpcy5jZW50cmFsRGlyUmVjb3JkcyYmMD09PXRoaXMuZmlsZXMubGVuZ3RoKXRocm93IG5ldyBFcnJvcihcIkNvcnJ1cHRlZCB6aXAgb3IgYnVnOiBleHBlY3RlZCBcIit0aGlzLmNlbnRyYWxEaXJSZWNvcmRzK1wiIHJlY29yZHMgaW4gY2VudHJhbCBkaXIsIGdvdCBcIit0aGlzLmZpbGVzLmxlbmd0aCl9LHJlYWRFbmRPZkNlbnRyYWw6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLnJlYWRlci5sYXN0SW5kZXhPZlNpZ25hdHVyZShzLkNFTlRSQUxfRElSRUNUT1JZX0VORCk7aWYoZTwwKXRocm93IXRoaXMuaXNTaWduYXR1cmUoMCxzLkxPQ0FMX0ZJTEVfSEVBREVSKT9uZXcgRXJyb3IoXCJDYW4ndCBmaW5kIGVuZCBvZiBjZW50cmFsIGRpcmVjdG9yeSA6IGlzIHRoaXMgYSB6aXAgZmlsZSA/IElmIGl0IGlzLCBzZWUgaHR0cHM6Ly9zdHVrLmdpdGh1Yi5pby9qc3ppcC9kb2N1bWVudGF0aW9uL2hvd3RvL3JlYWRfemlwLmh0bWxcIik6bmV3IEVycm9yKFwiQ29ycnVwdGVkIHppcDogY2FuJ3QgZmluZCBlbmQgb2YgY2VudHJhbCBkaXJlY3RvcnlcIik7dGhpcy5yZWFkZXIuc2V0SW5kZXgoZSk7dmFyIHQ9ZTtpZih0aGlzLmNoZWNrU2lnbmF0dXJlKHMuQ0VOVFJBTF9ESVJFQ1RPUllfRU5EKSx0aGlzLnJlYWRCbG9ja0VuZE9mQ2VudHJhbCgpLHRoaXMuZGlza051bWJlcj09PWkuTUFYX1ZBTFVFXzE2QklUU3x8dGhpcy5kaXNrV2l0aENlbnRyYWxEaXJTdGFydD09PWkuTUFYX1ZBTFVFXzE2QklUU3x8dGhpcy5jZW50cmFsRGlyUmVjb3Jkc09uVGhpc0Rpc2s9PT1pLk1BWF9WQUxVRV8xNkJJVFN8fHRoaXMuY2VudHJhbERpclJlY29yZHM9PT1pLk1BWF9WQUxVRV8xNkJJVFN8fHRoaXMuY2VudHJhbERpclNpemU9PT1pLk1BWF9WQUxVRV8zMkJJVFN8fHRoaXMuY2VudHJhbERpck9mZnNldD09PWkuTUFYX1ZBTFVFXzMyQklUUyl7aWYodGhpcy56aXA2ND0hMCwoZT10aGlzLnJlYWRlci5sYXN0SW5kZXhPZlNpZ25hdHVyZShzLlpJUDY0X0NFTlRSQUxfRElSRUNUT1JZX0xPQ0FUT1IpKTwwKXRocm93IG5ldyBFcnJvcihcIkNvcnJ1cHRlZCB6aXA6IGNhbid0IGZpbmQgdGhlIFpJUDY0IGVuZCBvZiBjZW50cmFsIGRpcmVjdG9yeSBsb2NhdG9yXCIpO2lmKHRoaXMucmVhZGVyLnNldEluZGV4KGUpLHRoaXMuY2hlY2tTaWduYXR1cmUocy5aSVA2NF9DRU5UUkFMX0RJUkVDVE9SWV9MT0NBVE9SKSx0aGlzLnJlYWRCbG9ja1ppcDY0RW5kT2ZDZW50cmFsTG9jYXRvcigpLCF0aGlzLmlzU2lnbmF0dXJlKHRoaXMucmVsYXRpdmVPZmZzZXRFbmRPZlppcDY0Q2VudHJhbERpcixzLlpJUDY0X0NFTlRSQUxfRElSRUNUT1JZX0VORCkmJih0aGlzLnJlbGF0aXZlT2Zmc2V0RW5kT2ZaaXA2NENlbnRyYWxEaXI9dGhpcy5yZWFkZXIubGFzdEluZGV4T2ZTaWduYXR1cmUocy5aSVA2NF9DRU5UUkFMX0RJUkVDVE9SWV9FTkQpLHRoaXMucmVsYXRpdmVPZmZzZXRFbmRPZlppcDY0Q2VudHJhbERpcjwwKSl0aHJvdyBuZXcgRXJyb3IoXCJDb3JydXB0ZWQgemlwOiBjYW4ndCBmaW5kIHRoZSBaSVA2NCBlbmQgb2YgY2VudHJhbCBkaXJlY3RvcnlcIik7dGhpcy5yZWFkZXIuc2V0SW5kZXgodGhpcy5yZWxhdGl2ZU9mZnNldEVuZE9mWmlwNjRDZW50cmFsRGlyKSx0aGlzLmNoZWNrU2lnbmF0dXJlKHMuWklQNjRfQ0VOVFJBTF9ESVJFQ1RPUllfRU5EKSx0aGlzLnJlYWRCbG9ja1ppcDY0RW5kT2ZDZW50cmFsKCl9dmFyIHI9dGhpcy5jZW50cmFsRGlyT2Zmc2V0K3RoaXMuY2VudHJhbERpclNpemU7dGhpcy56aXA2NCYmKHIrPTIwLHIrPTEyK3RoaXMuemlwNjRFbmRPZkNlbnRyYWxTaXplKTt2YXIgbj10LXI7aWYoMDxuKXRoaXMuaXNTaWduYXR1cmUodCxzLkNFTlRSQUxfRklMRV9IRUFERVIpfHwodGhpcy5yZWFkZXIuemVybz1uKTtlbHNlIGlmKG48MCl0aHJvdyBuZXcgRXJyb3IoXCJDb3JydXB0ZWQgemlwOiBtaXNzaW5nIFwiK01hdGguYWJzKG4pK1wiIGJ5dGVzLlwiKX0scHJlcGFyZVJlYWRlcjpmdW5jdGlvbihlKXt0aGlzLnJlYWRlcj1uKGUpfSxsb2FkOmZ1bmN0aW9uKGUpe3RoaXMucHJlcGFyZVJlYWRlcihlKSx0aGlzLnJlYWRFbmRPZkNlbnRyYWwoKSx0aGlzLnJlYWRDZW50cmFsRGlyKCksdGhpcy5yZWFkTG9jYWxGaWxlcygpfX0sdC5leHBvcnRzPWh9LHtcIi4vcmVhZGVyL3JlYWRlckZvclwiOjIyLFwiLi9zaWduYXR1cmVcIjoyMyxcIi4vc3VwcG9ydFwiOjMwLFwiLi91dGlsc1wiOjMyLFwiLi96aXBFbnRyeVwiOjM0fV0sMzQ6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1lKFwiLi9yZWFkZXIvcmVhZGVyRm9yXCIpLHM9ZShcIi4vdXRpbHNcIiksaT1lKFwiLi9jb21wcmVzc2VkT2JqZWN0XCIpLGE9ZShcIi4vY3JjMzJcIiksbz1lKFwiLi91dGY4XCIpLGg9ZShcIi4vY29tcHJlc3Npb25zXCIpLHU9ZShcIi4vc3VwcG9ydFwiKTtmdW5jdGlvbiBsKGUsdCl7dGhpcy5vcHRpb25zPWUsdGhpcy5sb2FkT3B0aW9ucz10fWwucHJvdG90eXBlPXtpc0VuY3J5cHRlZDpmdW5jdGlvbigpe3JldHVybiAxPT0oMSZ0aGlzLmJpdEZsYWcpfSx1c2VVVEY4OmZ1bmN0aW9uKCl7cmV0dXJuIDIwNDg9PSgyMDQ4JnRoaXMuYml0RmxhZyl9LHJlYWRMb2NhbFBhcnQ6ZnVuY3Rpb24oZSl7dmFyIHQscjtpZihlLnNraXAoMjIpLHRoaXMuZmlsZU5hbWVMZW5ndGg9ZS5yZWFkSW50KDIpLHI9ZS5yZWFkSW50KDIpLHRoaXMuZmlsZU5hbWU9ZS5yZWFkRGF0YSh0aGlzLmZpbGVOYW1lTGVuZ3RoKSxlLnNraXAociksLTE9PT10aGlzLmNvbXByZXNzZWRTaXplfHwtMT09PXRoaXMudW5jb21wcmVzc2VkU2l6ZSl0aHJvdyBuZXcgRXJyb3IoXCJCdWcgb3IgY29ycnVwdGVkIHppcCA6IGRpZG4ndCBnZXQgZW5vdWdoIGluZm9ybWF0aW9uIGZyb20gdGhlIGNlbnRyYWwgZGlyZWN0b3J5IChjb21wcmVzc2VkU2l6ZSA9PT0gLTEgfHwgdW5jb21wcmVzc2VkU2l6ZSA9PT0gLTEpXCIpO2lmKG51bGw9PT0odD1mdW5jdGlvbihlKXtmb3IodmFyIHQgaW4gaClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaCx0KSYmaFt0XS5tYWdpYz09PWUpcmV0dXJuIGhbdF07cmV0dXJuIG51bGx9KHRoaXMuY29tcHJlc3Npb25NZXRob2QpKSl0aHJvdyBuZXcgRXJyb3IoXCJDb3JydXB0ZWQgemlwIDogY29tcHJlc3Npb24gXCIrcy5wcmV0dHkodGhpcy5jb21wcmVzc2lvbk1ldGhvZCkrXCIgdW5rbm93biAoaW5uZXIgZmlsZSA6IFwiK3MudHJhbnNmb3JtVG8oXCJzdHJpbmdcIix0aGlzLmZpbGVOYW1lKStcIilcIik7dGhpcy5kZWNvbXByZXNzZWQ9bmV3IGkodGhpcy5jb21wcmVzc2VkU2l6ZSx0aGlzLnVuY29tcHJlc3NlZFNpemUsdGhpcy5jcmMzMix0LGUucmVhZERhdGEodGhpcy5jb21wcmVzc2VkU2l6ZSkpfSxyZWFkQ2VudHJhbFBhcnQ6ZnVuY3Rpb24oZSl7dGhpcy52ZXJzaW9uTWFkZUJ5PWUucmVhZEludCgyKSxlLnNraXAoMiksdGhpcy5iaXRGbGFnPWUucmVhZEludCgyKSx0aGlzLmNvbXByZXNzaW9uTWV0aG9kPWUucmVhZFN0cmluZygyKSx0aGlzLmRhdGU9ZS5yZWFkRGF0ZSgpLHRoaXMuY3JjMzI9ZS5yZWFkSW50KDQpLHRoaXMuY29tcHJlc3NlZFNpemU9ZS5yZWFkSW50KDQpLHRoaXMudW5jb21wcmVzc2VkU2l6ZT1lLnJlYWRJbnQoNCk7dmFyIHQ9ZS5yZWFkSW50KDIpO2lmKHRoaXMuZXh0cmFGaWVsZHNMZW5ndGg9ZS5yZWFkSW50KDIpLHRoaXMuZmlsZUNvbW1lbnRMZW5ndGg9ZS5yZWFkSW50KDIpLHRoaXMuZGlza051bWJlclN0YXJ0PWUucmVhZEludCgyKSx0aGlzLmludGVybmFsRmlsZUF0dHJpYnV0ZXM9ZS5yZWFkSW50KDIpLHRoaXMuZXh0ZXJuYWxGaWxlQXR0cmlidXRlcz1lLnJlYWRJbnQoNCksdGhpcy5sb2NhbEhlYWRlck9mZnNldD1lLnJlYWRJbnQoNCksdGhpcy5pc0VuY3J5cHRlZCgpKXRocm93IG5ldyBFcnJvcihcIkVuY3J5cHRlZCB6aXAgYXJlIG5vdCBzdXBwb3J0ZWRcIik7ZS5za2lwKHQpLHRoaXMucmVhZEV4dHJhRmllbGRzKGUpLHRoaXMucGFyc2VaSVA2NEV4dHJhRmllbGQoZSksdGhpcy5maWxlQ29tbWVudD1lLnJlYWREYXRhKHRoaXMuZmlsZUNvbW1lbnRMZW5ndGgpfSxwcm9jZXNzQXR0cmlidXRlczpmdW5jdGlvbigpe3RoaXMudW5peFBlcm1pc3Npb25zPW51bGwsdGhpcy5kb3NQZXJtaXNzaW9ucz1udWxsO3ZhciBlPXRoaXMudmVyc2lvbk1hZGVCeT4+ODt0aGlzLmRpcj0hISgxNiZ0aGlzLmV4dGVybmFsRmlsZUF0dHJpYnV0ZXMpLDA9PWUmJih0aGlzLmRvc1Blcm1pc3Npb25zPTYzJnRoaXMuZXh0ZXJuYWxGaWxlQXR0cmlidXRlcyksMz09ZSYmKHRoaXMudW5peFBlcm1pc3Npb25zPXRoaXMuZXh0ZXJuYWxGaWxlQXR0cmlidXRlcz4+MTYmNjU1MzUpLHRoaXMuZGlyfHxcIi9cIiE9PXRoaXMuZmlsZU5hbWVTdHIuc2xpY2UoLTEpfHwodGhpcy5kaXI9ITApfSxwYXJzZVpJUDY0RXh0cmFGaWVsZDpmdW5jdGlvbigpe2lmKHRoaXMuZXh0cmFGaWVsZHNbMV0pe3ZhciBlPW4odGhpcy5leHRyYUZpZWxkc1sxXS52YWx1ZSk7dGhpcy51bmNvbXByZXNzZWRTaXplPT09cy5NQVhfVkFMVUVfMzJCSVRTJiYodGhpcy51bmNvbXByZXNzZWRTaXplPWUucmVhZEludCg4KSksdGhpcy5jb21wcmVzc2VkU2l6ZT09PXMuTUFYX1ZBTFVFXzMyQklUUyYmKHRoaXMuY29tcHJlc3NlZFNpemU9ZS5yZWFkSW50KDgpKSx0aGlzLmxvY2FsSGVhZGVyT2Zmc2V0PT09cy5NQVhfVkFMVUVfMzJCSVRTJiYodGhpcy5sb2NhbEhlYWRlck9mZnNldD1lLnJlYWRJbnQoOCkpLHRoaXMuZGlza051bWJlclN0YXJ0PT09cy5NQVhfVkFMVUVfMzJCSVRTJiYodGhpcy5kaXNrTnVtYmVyU3RhcnQ9ZS5yZWFkSW50KDQpKX19LHJlYWRFeHRyYUZpZWxkczpmdW5jdGlvbihlKXt2YXIgdCxyLG4saT1lLmluZGV4K3RoaXMuZXh0cmFGaWVsZHNMZW5ndGg7Zm9yKHRoaXMuZXh0cmFGaWVsZHN8fCh0aGlzLmV4dHJhRmllbGRzPXt9KTtlLmluZGV4KzQ8aTspdD1lLnJlYWRJbnQoMikscj1lLnJlYWRJbnQoMiksbj1lLnJlYWREYXRhKHIpLHRoaXMuZXh0cmFGaWVsZHNbdF09e2lkOnQsbGVuZ3RoOnIsdmFsdWU6bn07ZS5zZXRJbmRleChpKX0saGFuZGxlVVRGODpmdW5jdGlvbigpe3ZhciBlPXUudWludDhhcnJheT9cInVpbnQ4YXJyYXlcIjpcImFycmF5XCI7aWYodGhpcy51c2VVVEY4KCkpdGhpcy5maWxlTmFtZVN0cj1vLnV0ZjhkZWNvZGUodGhpcy5maWxlTmFtZSksdGhpcy5maWxlQ29tbWVudFN0cj1vLnV0ZjhkZWNvZGUodGhpcy5maWxlQ29tbWVudCk7ZWxzZXt2YXIgdD10aGlzLmZpbmRFeHRyYUZpZWxkVW5pY29kZVBhdGgoKTtpZihudWxsIT09dCl0aGlzLmZpbGVOYW1lU3RyPXQ7ZWxzZXt2YXIgcj1zLnRyYW5zZm9ybVRvKGUsdGhpcy5maWxlTmFtZSk7dGhpcy5maWxlTmFtZVN0cj10aGlzLmxvYWRPcHRpb25zLmRlY29kZUZpbGVOYW1lKHIpfXZhciBuPXRoaXMuZmluZEV4dHJhRmllbGRVbmljb2RlQ29tbWVudCgpO2lmKG51bGwhPT1uKXRoaXMuZmlsZUNvbW1lbnRTdHI9bjtlbHNle3ZhciBpPXMudHJhbnNmb3JtVG8oZSx0aGlzLmZpbGVDb21tZW50KTt0aGlzLmZpbGVDb21tZW50U3RyPXRoaXMubG9hZE9wdGlvbnMuZGVjb2RlRmlsZU5hbWUoaSl9fX0sZmluZEV4dHJhRmllbGRVbmljb2RlUGF0aDpmdW5jdGlvbigpe3ZhciBlPXRoaXMuZXh0cmFGaWVsZHNbMjg3ODldO2lmKGUpe3ZhciB0PW4oZS52YWx1ZSk7cmV0dXJuIDEhPT10LnJlYWRJbnQoMSk/bnVsbDphKHRoaXMuZmlsZU5hbWUpIT09dC5yZWFkSW50KDQpP251bGw6by51dGY4ZGVjb2RlKHQucmVhZERhdGEoZS5sZW5ndGgtNSkpfXJldHVybiBudWxsfSxmaW5kRXh0cmFGaWVsZFVuaWNvZGVDb21tZW50OmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5leHRyYUZpZWxkc1syNTQ2MV07aWYoZSl7dmFyIHQ9bihlLnZhbHVlKTtyZXR1cm4gMSE9PXQucmVhZEludCgxKT9udWxsOmEodGhpcy5maWxlQ29tbWVudCkhPT10LnJlYWRJbnQoNCk/bnVsbDpvLnV0ZjhkZWNvZGUodC5yZWFkRGF0YShlLmxlbmd0aC01KSl9cmV0dXJuIG51bGx9fSx0LmV4cG9ydHM9bH0se1wiLi9jb21wcmVzc2VkT2JqZWN0XCI6MixcIi4vY29tcHJlc3Npb25zXCI6MyxcIi4vY3JjMzJcIjo0LFwiLi9yZWFkZXIvcmVhZGVyRm9yXCI6MjIsXCIuL3N1cHBvcnRcIjozMCxcIi4vdXRmOFwiOjMxLFwiLi91dGlsc1wiOjMyfV0sMzU6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKGUsdCxyKXt0aGlzLm5hbWU9ZSx0aGlzLmRpcj1yLmRpcix0aGlzLmRhdGU9ci5kYXRlLHRoaXMuY29tbWVudD1yLmNvbW1lbnQsdGhpcy51bml4UGVybWlzc2lvbnM9ci51bml4UGVybWlzc2lvbnMsdGhpcy5kb3NQZXJtaXNzaW9ucz1yLmRvc1Blcm1pc3Npb25zLHRoaXMuX2RhdGE9dCx0aGlzLl9kYXRhQmluYXJ5PXIuYmluYXJ5LHRoaXMub3B0aW9ucz17Y29tcHJlc3Npb246ci5jb21wcmVzc2lvbixjb21wcmVzc2lvbk9wdGlvbnM6ci5jb21wcmVzc2lvbk9wdGlvbnN9fXZhciBzPWUoXCIuL3N0cmVhbS9TdHJlYW1IZWxwZXJcIiksaT1lKFwiLi9zdHJlYW0vRGF0YVdvcmtlclwiKSxhPWUoXCIuL3V0ZjhcIiksbz1lKFwiLi9jb21wcmVzc2VkT2JqZWN0XCIpLGg9ZShcIi4vc3RyZWFtL0dlbmVyaWNXb3JrZXJcIik7bi5wcm90b3R5cGU9e2ludGVybmFsU3RyZWFtOmZ1bmN0aW9uKGUpe3ZhciB0PW51bGwscj1cInN0cmluZ1wiO3RyeXtpZighZSl0aHJvdyBuZXcgRXJyb3IoXCJObyBvdXRwdXQgdHlwZSBzcGVjaWZpZWQuXCIpO3ZhciBuPVwic3RyaW5nXCI9PT0ocj1lLnRvTG93ZXJDYXNlKCkpfHxcInRleHRcIj09PXI7XCJiaW5hcnlzdHJpbmdcIiE9PXImJlwidGV4dFwiIT09cnx8KHI9XCJzdHJpbmdcIiksdD10aGlzLl9kZWNvbXByZXNzV29ya2VyKCk7dmFyIGk9IXRoaXMuX2RhdGFCaW5hcnk7aSYmIW4mJih0PXQucGlwZShuZXcgYS5VdGY4RW5jb2RlV29ya2VyKSksIWkmJm4mJih0PXQucGlwZShuZXcgYS5VdGY4RGVjb2RlV29ya2VyKSl9Y2F0Y2goZSl7KHQ9bmV3IGgoXCJlcnJvclwiKSkuZXJyb3IoZSl9cmV0dXJuIG5ldyBzKHQscixcIlwiKX0sYXN5bmM6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcy5pbnRlcm5hbFN0cmVhbShlKS5hY2N1bXVsYXRlKHQpfSxub2RlU3RyZWFtOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMuaW50ZXJuYWxTdHJlYW0oZXx8XCJub2RlYnVmZmVyXCIpLnRvTm9kZWpzU3RyZWFtKHQpfSxfY29tcHJlc3NXb3JrZXI6ZnVuY3Rpb24oZSx0KXtpZih0aGlzLl9kYXRhIGluc3RhbmNlb2YgbyYmdGhpcy5fZGF0YS5jb21wcmVzc2lvbi5tYWdpYz09PWUubWFnaWMpcmV0dXJuIHRoaXMuX2RhdGEuZ2V0Q29tcHJlc3NlZFdvcmtlcigpO3ZhciByPXRoaXMuX2RlY29tcHJlc3NXb3JrZXIoKTtyZXR1cm4gdGhpcy5fZGF0YUJpbmFyeXx8KHI9ci5waXBlKG5ldyBhLlV0ZjhFbmNvZGVXb3JrZXIpKSxvLmNyZWF0ZVdvcmtlckZyb20ocixlLHQpfSxfZGVjb21wcmVzc1dvcmtlcjpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9kYXRhIGluc3RhbmNlb2Ygbz90aGlzLl9kYXRhLmdldENvbnRlbnRXb3JrZXIoKTp0aGlzLl9kYXRhIGluc3RhbmNlb2YgaD90aGlzLl9kYXRhOm5ldyBpKHRoaXMuX2RhdGEpfX07Zm9yKHZhciB1PVtcImFzVGV4dFwiLFwiYXNCaW5hcnlcIixcImFzTm9kZUJ1ZmZlclwiLFwiYXNVaW50OEFycmF5XCIsXCJhc0FycmF5QnVmZmVyXCJdLGw9ZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIG1ldGhvZCBoYXMgYmVlbiByZW1vdmVkIGluIEpTWmlwIDMuMCwgcGxlYXNlIGNoZWNrIHRoZSB1cGdyYWRlIGd1aWRlLlwiKX0sZj0wO2Y8dS5sZW5ndGg7ZisrKW4ucHJvdG90eXBlW3VbZl1dPWw7dC5leHBvcnRzPW59LHtcIi4vY29tcHJlc3NlZE9iamVjdFwiOjIsXCIuL3N0cmVhbS9EYXRhV29ya2VyXCI6MjcsXCIuL3N0cmVhbS9HZW5lcmljV29ya2VyXCI6MjgsXCIuL3N0cmVhbS9TdHJlYW1IZWxwZXJcIjoyOSxcIi4vdXRmOFwiOjMxfV0sMzY6W2Z1bmN0aW9uKGUsbCx0KXsoZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHIsbixlPXQuTXV0YXRpb25PYnNlcnZlcnx8dC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO2lmKGUpe3ZhciBpPTAscz1uZXcgZSh1KSxhPXQuZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIik7cy5vYnNlcnZlKGEse2NoYXJhY3RlckRhdGE6ITB9KSxyPWZ1bmN0aW9uKCl7YS5kYXRhPWk9KytpJTJ9fWVsc2UgaWYodC5zZXRJbW1lZGlhdGV8fHZvaWQgMD09PXQuTWVzc2FnZUNoYW5uZWwpcj1cImRvY3VtZW50XCJpbiB0JiZcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiaW4gdC5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpP2Z1bmN0aW9uKCl7dmFyIGU9dC5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO2Uub25yZWFkeXN0YXRlY2hhbmdlPWZ1bmN0aW9uKCl7dSgpLGUub25yZWFkeXN0YXRlY2hhbmdlPW51bGwsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGUpLGU9bnVsbH0sdC5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoZSl9OmZ1bmN0aW9uKCl7c2V0VGltZW91dCh1LDApfTtlbHNle3ZhciBvPW5ldyB0Lk1lc3NhZ2VDaGFubmVsO28ucG9ydDEub25tZXNzYWdlPXUscj1mdW5jdGlvbigpe28ucG9ydDIucG9zdE1lc3NhZ2UoMCl9fXZhciBoPVtdO2Z1bmN0aW9uIHUoKXt2YXIgZSx0O249ITA7Zm9yKHZhciByPWgubGVuZ3RoO3I7KXtmb3IodD1oLGg9W10sZT0tMTsrK2U8cjspdFtlXSgpO3I9aC5sZW5ndGh9bj0hMX1sLmV4cG9ydHM9ZnVuY3Rpb24oZSl7MSE9PWgucHVzaChlKXx8bnx8cigpfX0pLmNhbGwodGhpcyxcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2dsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZj9zZWxmOlwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93Ont9KX0se31dLDM3OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIGk9ZShcImltbWVkaWF0ZVwiKTtmdW5jdGlvbiB1KCl7fXZhciBsPXt9LHM9W1wiUkVKRUNURURcIl0sYT1bXCJGVUxGSUxMRURcIl0sbj1bXCJQRU5ESU5HXCJdO2Z1bmN0aW9uIG8oZSl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgZSl0aHJvdyBuZXcgVHlwZUVycm9yKFwicmVzb2x2ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO3RoaXMuc3RhdGU9bix0aGlzLnF1ZXVlPVtdLHRoaXMub3V0Y29tZT12b2lkIDAsZSE9PXUmJmQodGhpcyxlKX1mdW5jdGlvbiBoKGUsdCxyKXt0aGlzLnByb21pc2U9ZSxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYodGhpcy5vbkZ1bGZpbGxlZD10LHRoaXMuY2FsbEZ1bGZpbGxlZD10aGlzLm90aGVyQ2FsbEZ1bGZpbGxlZCksXCJmdW5jdGlvblwiPT10eXBlb2YgciYmKHRoaXMub25SZWplY3RlZD1yLHRoaXMuY2FsbFJlamVjdGVkPXRoaXMub3RoZXJDYWxsUmVqZWN0ZWQpfWZ1bmN0aW9uIGYodCxyLG4pe2koZnVuY3Rpb24oKXt2YXIgZTt0cnl7ZT1yKG4pfWNhdGNoKGUpe3JldHVybiBsLnJlamVjdCh0LGUpfWU9PT10P2wucmVqZWN0KHQsbmV3IFR5cGVFcnJvcihcIkNhbm5vdCByZXNvbHZlIHByb21pc2Ugd2l0aCBpdHNlbGZcIikpOmwucmVzb2x2ZSh0LGUpfSl9ZnVuY3Rpb24gYyhlKXt2YXIgdD1lJiZlLnRoZW47aWYoZSYmKFwib2JqZWN0XCI9PXR5cGVvZiBlfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBlKSYmXCJmdW5jdGlvblwiPT10eXBlb2YgdClyZXR1cm4gZnVuY3Rpb24oKXt0LmFwcGx5KGUsYXJndW1lbnRzKX19ZnVuY3Rpb24gZCh0LGUpe3ZhciByPSExO2Z1bmN0aW9uIG4oZSl7cnx8KHI9ITAsbC5yZWplY3QodCxlKSl9ZnVuY3Rpb24gaShlKXtyfHwocj0hMCxsLnJlc29sdmUodCxlKSl9dmFyIHM9cChmdW5jdGlvbigpe2UoaSxuKX0pO1wiZXJyb3JcIj09PXMuc3RhdHVzJiZuKHMudmFsdWUpfWZ1bmN0aW9uIHAoZSx0KXt2YXIgcj17fTt0cnl7ci52YWx1ZT1lKHQpLHIuc3RhdHVzPVwic3VjY2Vzc1wifWNhdGNoKGUpe3Iuc3RhdHVzPVwiZXJyb3JcIixyLnZhbHVlPWV9cmV0dXJuIHJ9KHQuZXhwb3J0cz1vKS5wcm90b3R5cGUuZmluYWxseT1mdW5jdGlvbih0KXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybiB0aGlzO3ZhciByPXRoaXMuY29uc3RydWN0b3I7cmV0dXJuIHRoaXMudGhlbihmdW5jdGlvbihlKXtyZXR1cm4gci5yZXNvbHZlKHQoKSkudGhlbihmdW5jdGlvbigpe3JldHVybiBlfSl9LGZ1bmN0aW9uKGUpe3JldHVybiByLnJlc29sdmUodCgpKS50aGVuKGZ1bmN0aW9uKCl7dGhyb3cgZX0pfSl9LG8ucHJvdG90eXBlLmNhdGNoPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLnRoZW4obnVsbCxlKX0sby5wcm90b3R5cGUudGhlbj1mdW5jdGlvbihlLHQpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUmJnRoaXMuc3RhdGU9PT1hfHxcImZ1bmN0aW9uXCIhPXR5cGVvZiB0JiZ0aGlzLnN0YXRlPT09cylyZXR1cm4gdGhpczt2YXIgcj1uZXcgdGhpcy5jb25zdHJ1Y3Rvcih1KTt0aGlzLnN0YXRlIT09bj9mKHIsdGhpcy5zdGF0ZT09PWE/ZTp0LHRoaXMub3V0Y29tZSk6dGhpcy5xdWV1ZS5wdXNoKG5ldyBoKHIsZSx0KSk7cmV0dXJuIHJ9LGgucHJvdG90eXBlLmNhbGxGdWxmaWxsZWQ9ZnVuY3Rpb24oZSl7bC5yZXNvbHZlKHRoaXMucHJvbWlzZSxlKX0saC5wcm90b3R5cGUub3RoZXJDYWxsRnVsZmlsbGVkPWZ1bmN0aW9uKGUpe2YodGhpcy5wcm9taXNlLHRoaXMub25GdWxmaWxsZWQsZSl9LGgucHJvdG90eXBlLmNhbGxSZWplY3RlZD1mdW5jdGlvbihlKXtsLnJlamVjdCh0aGlzLnByb21pc2UsZSl9LGgucHJvdG90eXBlLm90aGVyQ2FsbFJlamVjdGVkPWZ1bmN0aW9uKGUpe2YodGhpcy5wcm9taXNlLHRoaXMub25SZWplY3RlZCxlKX0sbC5yZXNvbHZlPWZ1bmN0aW9uKGUsdCl7dmFyIHI9cChjLHQpO2lmKFwiZXJyb3JcIj09PXIuc3RhdHVzKXJldHVybiBsLnJlamVjdChlLHIudmFsdWUpO3ZhciBuPXIudmFsdWU7aWYobilkKGUsbik7ZWxzZXtlLnN0YXRlPWEsZS5vdXRjb21lPXQ7Zm9yKHZhciBpPS0xLHM9ZS5xdWV1ZS5sZW5ndGg7KytpPHM7KWUucXVldWVbaV0uY2FsbEZ1bGZpbGxlZCh0KX1yZXR1cm4gZX0sbC5yZWplY3Q9ZnVuY3Rpb24oZSx0KXtlLnN0YXRlPXMsZS5vdXRjb21lPXQ7Zm9yKHZhciByPS0xLG49ZS5xdWV1ZS5sZW5ndGg7KytyPG47KWUucXVldWVbcl0uY2FsbFJlamVjdGVkKHQpO3JldHVybiBlfSxvLnJlc29sdmU9ZnVuY3Rpb24oZSl7aWYoZSBpbnN0YW5jZW9mIHRoaXMpcmV0dXJuIGU7cmV0dXJuIGwucmVzb2x2ZShuZXcgdGhpcyh1KSxlKX0sby5yZWplY3Q9ZnVuY3Rpb24oZSl7dmFyIHQ9bmV3IHRoaXModSk7cmV0dXJuIGwucmVqZWN0KHQsZSl9LG8uYWxsPWZ1bmN0aW9uKGUpe3ZhciByPXRoaXM7aWYoXCJbb2JqZWN0IEFycmF5XVwiIT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGUpKXJldHVybiB0aGlzLnJlamVjdChuZXcgVHlwZUVycm9yKFwibXVzdCBiZSBhbiBhcnJheVwiKSk7dmFyIG49ZS5sZW5ndGgsaT0hMTtpZighbilyZXR1cm4gdGhpcy5yZXNvbHZlKFtdKTt2YXIgcz1uZXcgQXJyYXkobiksYT0wLHQ9LTEsbz1uZXcgdGhpcyh1KTtmb3IoOysrdDxuOyloKGVbdF0sdCk7cmV0dXJuIG87ZnVuY3Rpb24gaChlLHQpe3IucmVzb2x2ZShlKS50aGVuKGZ1bmN0aW9uKGUpe3NbdF09ZSwrK2EhPT1ufHxpfHwoaT0hMCxsLnJlc29sdmUobyxzKSl9LGZ1bmN0aW9uKGUpe2l8fChpPSEwLGwucmVqZWN0KG8sZSkpfSl9fSxvLnJhY2U9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcztpZihcIltvYmplY3QgQXJyYXldXCIhPT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZSkpcmV0dXJuIHRoaXMucmVqZWN0KG5ldyBUeXBlRXJyb3IoXCJtdXN0IGJlIGFuIGFycmF5XCIpKTt2YXIgcj1lLmxlbmd0aCxuPSExO2lmKCFyKXJldHVybiB0aGlzLnJlc29sdmUoW10pO3ZhciBpPS0xLHM9bmV3IHRoaXModSk7Zm9yKDsrK2k8cjspYT1lW2ldLHQucmVzb2x2ZShhKS50aGVuKGZ1bmN0aW9uKGUpe258fChuPSEwLGwucmVzb2x2ZShzLGUpKX0sZnVuY3Rpb24oZSl7bnx8KG49ITAsbC5yZWplY3QocyxlKSl9KTt2YXIgYTtyZXR1cm4gc319LHtpbW1lZGlhdGU6MzZ9XSwzODpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPXt9OygwLGUoXCIuL2xpYi91dGlscy9jb21tb25cIikuYXNzaWduKShuLGUoXCIuL2xpYi9kZWZsYXRlXCIpLGUoXCIuL2xpYi9pbmZsYXRlXCIpLGUoXCIuL2xpYi96bGliL2NvbnN0YW50c1wiKSksdC5leHBvcnRzPW59LHtcIi4vbGliL2RlZmxhdGVcIjozOSxcIi4vbGliL2luZmxhdGVcIjo0MCxcIi4vbGliL3V0aWxzL2NvbW1vblwiOjQxLFwiLi9saWIvemxpYi9jb25zdGFudHNcIjo0NH1dLDM5OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIGE9ZShcIi4vemxpYi9kZWZsYXRlXCIpLG89ZShcIi4vdXRpbHMvY29tbW9uXCIpLGg9ZShcIi4vdXRpbHMvc3RyaW5nc1wiKSxpPWUoXCIuL3psaWIvbWVzc2FnZXNcIikscz1lKFwiLi96bGliL3pzdHJlYW1cIiksdT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLGw9MCxmPS0xLGM9MCxkPTg7ZnVuY3Rpb24gcChlKXtpZighKHRoaXMgaW5zdGFuY2VvZiBwKSlyZXR1cm4gbmV3IHAoZSk7dGhpcy5vcHRpb25zPW8uYXNzaWduKHtsZXZlbDpmLG1ldGhvZDpkLGNodW5rU2l6ZToxNjM4NCx3aW5kb3dCaXRzOjE1LG1lbUxldmVsOjgsc3RyYXRlZ3k6Yyx0bzpcIlwifSxlfHx7fSk7dmFyIHQ9dGhpcy5vcHRpb25zO3QucmF3JiYwPHQud2luZG93Qml0cz90LndpbmRvd0JpdHM9LXQud2luZG93Qml0czp0Lmd6aXAmJjA8dC53aW5kb3dCaXRzJiZ0LndpbmRvd0JpdHM8MTYmJih0LndpbmRvd0JpdHMrPTE2KSx0aGlzLmVycj0wLHRoaXMubXNnPVwiXCIsdGhpcy5lbmRlZD0hMSx0aGlzLmNodW5rcz1bXSx0aGlzLnN0cm09bmV3IHMsdGhpcy5zdHJtLmF2YWlsX291dD0wO3ZhciByPWEuZGVmbGF0ZUluaXQyKHRoaXMuc3RybSx0LmxldmVsLHQubWV0aG9kLHQud2luZG93Qml0cyx0Lm1lbUxldmVsLHQuc3RyYXRlZ3kpO2lmKHIhPT1sKXRocm93IG5ldyBFcnJvcihpW3JdKTtpZih0LmhlYWRlciYmYS5kZWZsYXRlU2V0SGVhZGVyKHRoaXMuc3RybSx0LmhlYWRlciksdC5kaWN0aW9uYXJ5KXt2YXIgbjtpZihuPVwic3RyaW5nXCI9PXR5cGVvZiB0LmRpY3Rpb25hcnk/aC5zdHJpbmcyYnVmKHQuZGljdGlvbmFyeSk6XCJbb2JqZWN0IEFycmF5QnVmZmVyXVwiPT09dS5jYWxsKHQuZGljdGlvbmFyeSk/bmV3IFVpbnQ4QXJyYXkodC5kaWN0aW9uYXJ5KTp0LmRpY3Rpb25hcnksKHI9YS5kZWZsYXRlU2V0RGljdGlvbmFyeSh0aGlzLnN0cm0sbikpIT09bCl0aHJvdyBuZXcgRXJyb3IoaVtyXSk7dGhpcy5fZGljdF9zZXQ9ITB9fWZ1bmN0aW9uIG4oZSx0KXt2YXIgcj1uZXcgcCh0KTtpZihyLnB1c2goZSwhMCksci5lcnIpdGhyb3cgci5tc2d8fGlbci5lcnJdO3JldHVybiByLnJlc3VsdH1wLnByb3RvdHlwZS5wdXNoPWZ1bmN0aW9uKGUsdCl7dmFyIHIsbixpPXRoaXMuc3RybSxzPXRoaXMub3B0aW9ucy5jaHVua1NpemU7aWYodGhpcy5lbmRlZClyZXR1cm4hMTtuPXQ9PT1+fnQ/dDohMD09PXQ/NDowLFwic3RyaW5nXCI9PXR5cGVvZiBlP2kuaW5wdXQ9aC5zdHJpbmcyYnVmKGUpOlwiW29iamVjdCBBcnJheUJ1ZmZlcl1cIj09PXUuY2FsbChlKT9pLmlucHV0PW5ldyBVaW50OEFycmF5KGUpOmkuaW5wdXQ9ZSxpLm5leHRfaW49MCxpLmF2YWlsX2luPWkuaW5wdXQubGVuZ3RoO2Rve2lmKDA9PT1pLmF2YWlsX291dCYmKGkub3V0cHV0PW5ldyBvLkJ1ZjgocyksaS5uZXh0X291dD0wLGkuYXZhaWxfb3V0PXMpLDEhPT0ocj1hLmRlZmxhdGUoaSxuKSkmJnIhPT1sKXJldHVybiB0aGlzLm9uRW5kKHIpLCEodGhpcy5lbmRlZD0hMCk7MCE9PWkuYXZhaWxfb3V0JiYoMCE9PWkuYXZhaWxfaW58fDQhPT1uJiYyIT09bil8fChcInN0cmluZ1wiPT09dGhpcy5vcHRpb25zLnRvP3RoaXMub25EYXRhKGguYnVmMmJpbnN0cmluZyhvLnNocmlua0J1ZihpLm91dHB1dCxpLm5leHRfb3V0KSkpOnRoaXMub25EYXRhKG8uc2hyaW5rQnVmKGkub3V0cHV0LGkubmV4dF9vdXQpKSl9d2hpbGUoKDA8aS5hdmFpbF9pbnx8MD09PWkuYXZhaWxfb3V0KSYmMSE9PXIpO3JldHVybiA0PT09bj8ocj1hLmRlZmxhdGVFbmQodGhpcy5zdHJtKSx0aGlzLm9uRW5kKHIpLHRoaXMuZW5kZWQ9ITAscj09PWwpOjIhPT1ufHwodGhpcy5vbkVuZChsKSwhKGkuYXZhaWxfb3V0PTApKX0scC5wcm90b3R5cGUub25EYXRhPWZ1bmN0aW9uKGUpe3RoaXMuY2h1bmtzLnB1c2goZSl9LHAucHJvdG90eXBlLm9uRW5kPWZ1bmN0aW9uKGUpe2U9PT1sJiYoXCJzdHJpbmdcIj09PXRoaXMub3B0aW9ucy50bz90aGlzLnJlc3VsdD10aGlzLmNodW5rcy5qb2luKFwiXCIpOnRoaXMucmVzdWx0PW8uZmxhdHRlbkNodW5rcyh0aGlzLmNodW5rcykpLHRoaXMuY2h1bmtzPVtdLHRoaXMuZXJyPWUsdGhpcy5tc2c9dGhpcy5zdHJtLm1zZ30sci5EZWZsYXRlPXAsci5kZWZsYXRlPW4sci5kZWZsYXRlUmF3PWZ1bmN0aW9uKGUsdCl7cmV0dXJuKHQ9dHx8e30pLnJhdz0hMCxuKGUsdCl9LHIuZ3ppcD1mdW5jdGlvbihlLHQpe3JldHVybih0PXR8fHt9KS5nemlwPSEwLG4oZSx0KX19LHtcIi4vdXRpbHMvY29tbW9uXCI6NDEsXCIuL3V0aWxzL3N0cmluZ3NcIjo0MixcIi4vemxpYi9kZWZsYXRlXCI6NDYsXCIuL3psaWIvbWVzc2FnZXNcIjo1MSxcIi4vemxpYi96c3RyZWFtXCI6NTN9XSw0MDpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBjPWUoXCIuL3psaWIvaW5mbGF0ZVwiKSxkPWUoXCIuL3V0aWxzL2NvbW1vblwiKSxwPWUoXCIuL3V0aWxzL3N0cmluZ3NcIiksbT1lKFwiLi96bGliL2NvbnN0YW50c1wiKSxuPWUoXCIuL3psaWIvbWVzc2FnZXNcIiksaT1lKFwiLi96bGliL3pzdHJlYW1cIikscz1lKFwiLi96bGliL2d6aGVhZGVyXCIpLF89T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztmdW5jdGlvbiBhKGUpe2lmKCEodGhpcyBpbnN0YW5jZW9mIGEpKXJldHVybiBuZXcgYShlKTt0aGlzLm9wdGlvbnM9ZC5hc3NpZ24oe2NodW5rU2l6ZToxNjM4NCx3aW5kb3dCaXRzOjAsdG86XCJcIn0sZXx8e30pO3ZhciB0PXRoaXMub3B0aW9uczt0LnJhdyYmMDw9dC53aW5kb3dCaXRzJiZ0LndpbmRvd0JpdHM8MTYmJih0LndpbmRvd0JpdHM9LXQud2luZG93Qml0cywwPT09dC53aW5kb3dCaXRzJiYodC53aW5kb3dCaXRzPS0xNSkpLCEoMDw9dC53aW5kb3dCaXRzJiZ0LndpbmRvd0JpdHM8MTYpfHxlJiZlLndpbmRvd0JpdHN8fCh0LndpbmRvd0JpdHMrPTMyKSwxNTx0LndpbmRvd0JpdHMmJnQud2luZG93Qml0czw0OCYmMD09KDE1JnQud2luZG93Qml0cykmJih0LndpbmRvd0JpdHN8PTE1KSx0aGlzLmVycj0wLHRoaXMubXNnPVwiXCIsdGhpcy5lbmRlZD0hMSx0aGlzLmNodW5rcz1bXSx0aGlzLnN0cm09bmV3IGksdGhpcy5zdHJtLmF2YWlsX291dD0wO3ZhciByPWMuaW5mbGF0ZUluaXQyKHRoaXMuc3RybSx0LndpbmRvd0JpdHMpO2lmKHIhPT1tLlpfT0spdGhyb3cgbmV3IEVycm9yKG5bcl0pO3RoaXMuaGVhZGVyPW5ldyBzLGMuaW5mbGF0ZUdldEhlYWRlcih0aGlzLnN0cm0sdGhpcy5oZWFkZXIpfWZ1bmN0aW9uIG8oZSx0KXt2YXIgcj1uZXcgYSh0KTtpZihyLnB1c2goZSwhMCksci5lcnIpdGhyb3cgci5tc2d8fG5bci5lcnJdO3JldHVybiByLnJlc3VsdH1hLnByb3RvdHlwZS5wdXNoPWZ1bmN0aW9uKGUsdCl7dmFyIHIsbixpLHMsYSxvLGg9dGhpcy5zdHJtLHU9dGhpcy5vcHRpb25zLmNodW5rU2l6ZSxsPXRoaXMub3B0aW9ucy5kaWN0aW9uYXJ5LGY9ITE7aWYodGhpcy5lbmRlZClyZXR1cm4hMTtuPXQ9PT1+fnQ/dDohMD09PXQ/bS5aX0ZJTklTSDptLlpfTk9fRkxVU0gsXCJzdHJpbmdcIj09dHlwZW9mIGU/aC5pbnB1dD1wLmJpbnN0cmluZzJidWYoZSk6XCJbb2JqZWN0IEFycmF5QnVmZmVyXVwiPT09Xy5jYWxsKGUpP2guaW5wdXQ9bmV3IFVpbnQ4QXJyYXkoZSk6aC5pbnB1dD1lLGgubmV4dF9pbj0wLGguYXZhaWxfaW49aC5pbnB1dC5sZW5ndGg7ZG97aWYoMD09PWguYXZhaWxfb3V0JiYoaC5vdXRwdXQ9bmV3IGQuQnVmOCh1KSxoLm5leHRfb3V0PTAsaC5hdmFpbF9vdXQ9dSksKHI9Yy5pbmZsYXRlKGgsbS5aX05PX0ZMVVNIKSk9PT1tLlpfTkVFRF9ESUNUJiZsJiYobz1cInN0cmluZ1wiPT10eXBlb2YgbD9wLnN0cmluZzJidWYobCk6XCJbb2JqZWN0IEFycmF5QnVmZmVyXVwiPT09Xy5jYWxsKGwpP25ldyBVaW50OEFycmF5KGwpOmwscj1jLmluZmxhdGVTZXREaWN0aW9uYXJ5KHRoaXMuc3RybSxvKSkscj09PW0uWl9CVUZfRVJST1ImJiEwPT09ZiYmKHI9bS5aX09LLGY9ITEpLHIhPT1tLlpfU1RSRUFNX0VORCYmciE9PW0uWl9PSylyZXR1cm4gdGhpcy5vbkVuZChyKSwhKHRoaXMuZW5kZWQ9ITApO2gubmV4dF9vdXQmJigwIT09aC5hdmFpbF9vdXQmJnIhPT1tLlpfU1RSRUFNX0VORCYmKDAhPT1oLmF2YWlsX2lufHxuIT09bS5aX0ZJTklTSCYmbiE9PW0uWl9TWU5DX0ZMVVNIKXx8KFwic3RyaW5nXCI9PT10aGlzLm9wdGlvbnMudG8/KGk9cC51dGY4Ym9yZGVyKGgub3V0cHV0LGgubmV4dF9vdXQpLHM9aC5uZXh0X291dC1pLGE9cC5idWYyc3RyaW5nKGgub3V0cHV0LGkpLGgubmV4dF9vdXQ9cyxoLmF2YWlsX291dD11LXMscyYmZC5hcnJheVNldChoLm91dHB1dCxoLm91dHB1dCxpLHMsMCksdGhpcy5vbkRhdGEoYSkpOnRoaXMub25EYXRhKGQuc2hyaW5rQnVmKGgub3V0cHV0LGgubmV4dF9vdXQpKSkpLDA9PT1oLmF2YWlsX2luJiYwPT09aC5hdmFpbF9vdXQmJihmPSEwKX13aGlsZSgoMDxoLmF2YWlsX2lufHwwPT09aC5hdmFpbF9vdXQpJiZyIT09bS5aX1NUUkVBTV9FTkQpO3JldHVybiByPT09bS5aX1NUUkVBTV9FTkQmJihuPW0uWl9GSU5JU0gpLG49PT1tLlpfRklOSVNIPyhyPWMuaW5mbGF0ZUVuZCh0aGlzLnN0cm0pLHRoaXMub25FbmQociksdGhpcy5lbmRlZD0hMCxyPT09bS5aX09LKTpuIT09bS5aX1NZTkNfRkxVU0h8fCh0aGlzLm9uRW5kKG0uWl9PSyksIShoLmF2YWlsX291dD0wKSl9LGEucHJvdG90eXBlLm9uRGF0YT1mdW5jdGlvbihlKXt0aGlzLmNodW5rcy5wdXNoKGUpfSxhLnByb3RvdHlwZS5vbkVuZD1mdW5jdGlvbihlKXtlPT09bS5aX09LJiYoXCJzdHJpbmdcIj09PXRoaXMub3B0aW9ucy50bz90aGlzLnJlc3VsdD10aGlzLmNodW5rcy5qb2luKFwiXCIpOnRoaXMucmVzdWx0PWQuZmxhdHRlbkNodW5rcyh0aGlzLmNodW5rcykpLHRoaXMuY2h1bmtzPVtdLHRoaXMuZXJyPWUsdGhpcy5tc2c9dGhpcy5zdHJtLm1zZ30sci5JbmZsYXRlPWEsci5pbmZsYXRlPW8sci5pbmZsYXRlUmF3PWZ1bmN0aW9uKGUsdCl7cmV0dXJuKHQ9dHx8e30pLnJhdz0hMCxvKGUsdCl9LHIudW5nemlwPW99LHtcIi4vdXRpbHMvY29tbW9uXCI6NDEsXCIuL3V0aWxzL3N0cmluZ3NcIjo0MixcIi4vemxpYi9jb25zdGFudHNcIjo0NCxcIi4vemxpYi9nemhlYWRlclwiOjQ3LFwiLi96bGliL2luZmxhdGVcIjo0OSxcIi4vemxpYi9tZXNzYWdlc1wiOjUxLFwiLi96bGliL3pzdHJlYW1cIjo1M31dLDQxOltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFVpbnQ4QXJyYXkmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBVaW50MTZBcnJheSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIEludDMyQXJyYXk7ci5hc3NpZ249ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKTt0Lmxlbmd0aDspe3ZhciByPXQuc2hpZnQoKTtpZihyKXtpZihcIm9iamVjdFwiIT10eXBlb2Ygcil0aHJvdyBuZXcgVHlwZUVycm9yKHIrXCJtdXN0IGJlIG5vbi1vYmplY3RcIik7Zm9yKHZhciBuIGluIHIpci5oYXNPd25Qcm9wZXJ0eShuKSYmKGVbbl09cltuXSl9fXJldHVybiBlfSxyLnNocmlua0J1Zj1mdW5jdGlvbihlLHQpe3JldHVybiBlLmxlbmd0aD09PXQ/ZTplLnN1YmFycmF5P2Uuc3ViYXJyYXkoMCx0KTooZS5sZW5ndGg9dCxlKX07dmFyIGk9e2FycmF5U2V0OmZ1bmN0aW9uKGUsdCxyLG4saSl7aWYodC5zdWJhcnJheSYmZS5zdWJhcnJheSllLnNldCh0LnN1YmFycmF5KHIscituKSxpKTtlbHNlIGZvcih2YXIgcz0wO3M8bjtzKyspZVtpK3NdPXRbcitzXX0sZmxhdHRlbkNodW5rczpmdW5jdGlvbihlKXt2YXIgdCxyLG4saSxzLGE7Zm9yKHQ9bj0wLHI9ZS5sZW5ndGg7dDxyO3QrKyluKz1lW3RdLmxlbmd0aDtmb3IoYT1uZXcgVWludDhBcnJheShuKSx0PWk9MCxyPWUubGVuZ3RoO3Q8cjt0Kyspcz1lW3RdLGEuc2V0KHMsaSksaSs9cy5sZW5ndGg7cmV0dXJuIGF9fSxzPXthcnJheVNldDpmdW5jdGlvbihlLHQscixuLGkpe2Zvcih2YXIgcz0wO3M8bjtzKyspZVtpK3NdPXRbcitzXX0sZmxhdHRlbkNodW5rczpmdW5jdGlvbihlKXtyZXR1cm5bXS5jb25jYXQuYXBwbHkoW10sZSl9fTtyLnNldFR5cGVkPWZ1bmN0aW9uKGUpe2U/KHIuQnVmOD1VaW50OEFycmF5LHIuQnVmMTY9VWludDE2QXJyYXksci5CdWYzMj1JbnQzMkFycmF5LHIuYXNzaWduKHIsaSkpOihyLkJ1Zjg9QXJyYXksci5CdWYxNj1BcnJheSxyLkJ1ZjMyPUFycmF5LHIuYXNzaWduKHIscykpfSxyLnNldFR5cGVkKG4pfSx7fV0sNDI6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgaD1lKFwiLi9jb21tb25cIiksaT0hMCxzPSEwO3RyeXtTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsWzBdKX1jYXRjaChlKXtpPSExfXRyeXtTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsbmV3IFVpbnQ4QXJyYXkoMSkpfWNhdGNoKGUpe3M9ITF9Zm9yKHZhciB1PW5ldyBoLkJ1ZjgoMjU2KSxuPTA7bjwyNTY7bisrKXVbbl09MjUyPD1uPzY6MjQ4PD1uPzU6MjQwPD1uPzQ6MjI0PD1uPzM6MTkyPD1uPzI6MTtmdW5jdGlvbiBsKGUsdCl7aWYodDw2NTUzNyYmKGUuc3ViYXJyYXkmJnN8fCFlLnN1YmFycmF5JiZpKSlyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLGguc2hyaW5rQnVmKGUsdCkpO2Zvcih2YXIgcj1cIlwiLG49MDtuPHQ7bisrKXIrPVN0cmluZy5mcm9tQ2hhckNvZGUoZVtuXSk7cmV0dXJuIHJ9dVsyNTRdPXVbMjU0XT0xLHIuc3RyaW5nMmJ1Zj1mdW5jdGlvbihlKXt2YXIgdCxyLG4saSxzLGE9ZS5sZW5ndGgsbz0wO2ZvcihpPTA7aTxhO2krKyk1NTI5Nj09KDY0NTEyJihyPWUuY2hhckNvZGVBdChpKSkpJiZpKzE8YSYmNTYzMjA9PSg2NDUxMiYobj1lLmNoYXJDb2RlQXQoaSsxKSkpJiYocj02NTUzNisoci01NTI5Njw8MTApKyhuLTU2MzIwKSxpKyspLG8rPXI8MTI4PzE6cjwyMDQ4PzI6cjw2NTUzNj8zOjQ7Zm9yKHQ9bmV3IGguQnVmOChvKSxpPXM9MDtzPG87aSsrKTU1Mjk2PT0oNjQ1MTImKHI9ZS5jaGFyQ29kZUF0KGkpKSkmJmkrMTxhJiY1NjMyMD09KDY0NTEyJihuPWUuY2hhckNvZGVBdChpKzEpKSkmJihyPTY1NTM2KyhyLTU1Mjk2PDwxMCkrKG4tNTYzMjApLGkrKykscjwxMjg/dFtzKytdPXI6KHI8MjA0OD90W3MrK109MTkyfHI+Pj42OihyPDY1NTM2P3RbcysrXT0yMjR8cj4+PjEyOih0W3MrK109MjQwfHI+Pj4xOCx0W3MrK109MTI4fHI+Pj4xMiY2MyksdFtzKytdPTEyOHxyPj4+NiY2MyksdFtzKytdPTEyOHw2MyZyKTtyZXR1cm4gdH0sci5idWYyYmluc3RyaW5nPWZ1bmN0aW9uKGUpe3JldHVybiBsKGUsZS5sZW5ndGgpfSxyLmJpbnN0cmluZzJidWY9ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PW5ldyBoLkJ1ZjgoZS5sZW5ndGgpLHI9MCxuPXQubGVuZ3RoO3I8bjtyKyspdFtyXT1lLmNoYXJDb2RlQXQocik7cmV0dXJuIHR9LHIuYnVmMnN0cmluZz1mdW5jdGlvbihlLHQpe3ZhciByLG4saSxzLGE9dHx8ZS5sZW5ndGgsbz1uZXcgQXJyYXkoMiphKTtmb3Iocj1uPTA7cjxhOylpZigoaT1lW3IrK10pPDEyOClvW24rK109aTtlbHNlIGlmKDQ8KHM9dVtpXSkpb1tuKytdPTY1NTMzLHIrPXMtMTtlbHNle2ZvcihpJj0yPT09cz8zMTozPT09cz8xNTo3OzE8cyYmcjxhOylpPWk8PDZ8NjMmZVtyKytdLHMtLTsxPHM/b1tuKytdPTY1NTMzOmk8NjU1MzY/b1tuKytdPWk6KGktPTY1NTM2LG9bbisrXT01NTI5NnxpPj4xMCYxMDIzLG9bbisrXT01NjMyMHwxMDIzJmkpfXJldHVybiBsKG8sbil9LHIudXRmOGJvcmRlcj1mdW5jdGlvbihlLHQpe3ZhciByO2ZvcigodD10fHxlLmxlbmd0aCk+ZS5sZW5ndGgmJih0PWUubGVuZ3RoKSxyPXQtMTswPD1yJiYxMjg9PSgxOTImZVtyXSk7KXItLTtyZXR1cm4gcjwwP3Q6MD09PXI/dDpyK3VbZVtyXV0+dD9yOnR9fSx7XCIuL2NvbW1vblwiOjQxfV0sNDM6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt0LmV4cG9ydHM9ZnVuY3Rpb24oZSx0LHIsbil7Zm9yKHZhciBpPTY1NTM1JmV8MCxzPWU+Pj4xNiY2NTUzNXwwLGE9MDswIT09cjspe2ZvcihyLT1hPTJlMzxyPzJlMzpyO3M9cysoaT1pK3RbbisrXXwwKXwwLC0tYTspO2klPTY1NTIxLHMlPTY1NTIxfXJldHVybiBpfHM8PDE2fDB9fSx7fV0sNDQ6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt0LmV4cG9ydHM9e1pfTk9fRkxVU0g6MCxaX1BBUlRJQUxfRkxVU0g6MSxaX1NZTkNfRkxVU0g6MixaX0ZVTExfRkxVU0g6MyxaX0ZJTklTSDo0LFpfQkxPQ0s6NSxaX1RSRUVTOjYsWl9PSzowLFpfU1RSRUFNX0VORDoxLFpfTkVFRF9ESUNUOjIsWl9FUlJOTzotMSxaX1NUUkVBTV9FUlJPUjotMixaX0RBVEFfRVJST1I6LTMsWl9CVUZfRVJST1I6LTUsWl9OT19DT01QUkVTU0lPTjowLFpfQkVTVF9TUEVFRDoxLFpfQkVTVF9DT01QUkVTU0lPTjo5LFpfREVGQVVMVF9DT01QUkVTU0lPTjotMSxaX0ZJTFRFUkVEOjEsWl9IVUZGTUFOX09OTFk6MixaX1JMRTozLFpfRklYRUQ6NCxaX0RFRkFVTFRfU1RSQVRFR1k6MCxaX0JJTkFSWTowLFpfVEVYVDoxLFpfVU5LTk9XTjoyLFpfREVGTEFURUQ6OH19LHt9XSw0NTpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBvPWZ1bmN0aW9uKCl7Zm9yKHZhciBlLHQ9W10scj0wO3I8MjU2O3IrKyl7ZT1yO2Zvcih2YXIgbj0wO248ODtuKyspZT0xJmU/Mzk4ODI5MjM4NF5lPj4+MTplPj4+MTt0W3JdPWV9cmV0dXJuIHR9KCk7dC5leHBvcnRzPWZ1bmN0aW9uKGUsdCxyLG4pe3ZhciBpPW8scz1uK3I7ZV49LTE7Zm9yKHZhciBhPW47YTxzO2ErKyllPWU+Pj44XmlbMjU1JihlXnRbYV0pXTtyZXR1cm4tMV5lfX0se31dLDQ2OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIGgsYz1lKFwiLi4vdXRpbHMvY29tbW9uXCIpLHU9ZShcIi4vdHJlZXNcIiksZD1lKFwiLi9hZGxlcjMyXCIpLHA9ZShcIi4vY3JjMzJcIiksbj1lKFwiLi9tZXNzYWdlc1wiKSxsPTAsZj00LG09MCxfPS0yLGc9LTEsYj00LGk9Mix2PTgseT05LHM9Mjg2LGE9MzAsbz0xOSx3PTIqcysxLGs9MTUseD0zLFM9MjU4LHo9Uyt4KzEsQz00MixFPTExMyxBPTEsST0yLE89MyxCPTQ7ZnVuY3Rpb24gUihlLHQpe3JldHVybiBlLm1zZz1uW3RdLHR9ZnVuY3Rpb24gVChlKXtyZXR1cm4oZTw8MSktKDQ8ZT85OjApfWZ1bmN0aW9uIEQoZSl7Zm9yKHZhciB0PWUubGVuZ3RoOzA8PS0tdDspZVt0XT0wfWZ1bmN0aW9uIEYoZSl7dmFyIHQ9ZS5zdGF0ZSxyPXQucGVuZGluZztyPmUuYXZhaWxfb3V0JiYocj1lLmF2YWlsX291dCksMCE9PXImJihjLmFycmF5U2V0KGUub3V0cHV0LHQucGVuZGluZ19idWYsdC5wZW5kaW5nX291dCxyLGUubmV4dF9vdXQpLGUubmV4dF9vdXQrPXIsdC5wZW5kaW5nX291dCs9cixlLnRvdGFsX291dCs9cixlLmF2YWlsX291dC09cix0LnBlbmRpbmctPXIsMD09PXQucGVuZGluZyYmKHQucGVuZGluZ19vdXQ9MCkpfWZ1bmN0aW9uIE4oZSx0KXt1Ll90cl9mbHVzaF9ibG9jayhlLDA8PWUuYmxvY2tfc3RhcnQ/ZS5ibG9ja19zdGFydDotMSxlLnN0cnN0YXJ0LWUuYmxvY2tfc3RhcnQsdCksZS5ibG9ja19zdGFydD1lLnN0cnN0YXJ0LEYoZS5zdHJtKX1mdW5jdGlvbiBVKGUsdCl7ZS5wZW5kaW5nX2J1ZltlLnBlbmRpbmcrK109dH1mdW5jdGlvbiBQKGUsdCl7ZS5wZW5kaW5nX2J1ZltlLnBlbmRpbmcrK109dD4+PjgmMjU1LGUucGVuZGluZ19idWZbZS5wZW5kaW5nKytdPTI1NSZ0fWZ1bmN0aW9uIEwoZSx0KXt2YXIgcixuLGk9ZS5tYXhfY2hhaW5fbGVuZ3RoLHM9ZS5zdHJzdGFydCxhPWUucHJldl9sZW5ndGgsbz1lLm5pY2VfbWF0Y2gsaD1lLnN0cnN0YXJ0PmUud19zaXplLXo/ZS5zdHJzdGFydC0oZS53X3NpemUteik6MCx1PWUud2luZG93LGw9ZS53X21hc2ssZj1lLnByZXYsYz1lLnN0cnN0YXJ0K1MsZD11W3MrYS0xXSxwPXVbcythXTtlLnByZXZfbGVuZ3RoPj1lLmdvb2RfbWF0Y2gmJihpPj49Miksbz5lLmxvb2thaGVhZCYmKG89ZS5sb29rYWhlYWQpO2Rve2lmKHVbKHI9dCkrYV09PT1wJiZ1W3IrYS0xXT09PWQmJnVbcl09PT11W3NdJiZ1Wysrcl09PT11W3MrMV0pe3MrPTIscisrO2Rve313aGlsZSh1Wysrc109PT11Wysrcl0mJnVbKytzXT09PXVbKytyXSYmdVsrK3NdPT09dVsrK3JdJiZ1Wysrc109PT11Wysrcl0mJnVbKytzXT09PXVbKytyXSYmdVsrK3NdPT09dVsrK3JdJiZ1Wysrc109PT11Wysrcl0mJnVbKytzXT09PXVbKytyXSYmczxjKTtpZihuPVMtKGMtcykscz1jLVMsYTxuKXtpZihlLm1hdGNoX3N0YXJ0PXQsbzw9KGE9bikpYnJlYWs7ZD11W3MrYS0xXSxwPXVbcythXX19fXdoaWxlKCh0PWZbdCZsXSk+aCYmMCE9LS1pKTtyZXR1cm4gYTw9ZS5sb29rYWhlYWQ/YTplLmxvb2thaGVhZH1mdW5jdGlvbiBqKGUpe3ZhciB0LHIsbixpLHMsYSxvLGgsdSxsLGY9ZS53X3NpemU7ZG97aWYoaT1lLndpbmRvd19zaXplLWUubG9va2FoZWFkLWUuc3Ryc3RhcnQsZS5zdHJzdGFydD49ZisoZi16KSl7Zm9yKGMuYXJyYXlTZXQoZS53aW5kb3csZS53aW5kb3csZixmLDApLGUubWF0Y2hfc3RhcnQtPWYsZS5zdHJzdGFydC09ZixlLmJsb2NrX3N0YXJ0LT1mLHQ9cj1lLmhhc2hfc2l6ZTtuPWUuaGVhZFstLXRdLGUuaGVhZFt0XT1mPD1uP24tZjowLC0tcjspO2Zvcih0PXI9ZjtuPWUucHJldlstLXRdLGUucHJldlt0XT1mPD1uP24tZjowLC0tcjspO2krPWZ9aWYoMD09PWUuc3RybS5hdmFpbF9pbilicmVhaztpZihhPWUuc3RybSxvPWUud2luZG93LGg9ZS5zdHJzdGFydCtlLmxvb2thaGVhZCx1PWksbD12b2lkIDAsbD1hLmF2YWlsX2luLHU8bCYmKGw9dSkscj0wPT09bD8wOihhLmF2YWlsX2luLT1sLGMuYXJyYXlTZXQobyxhLmlucHV0LGEubmV4dF9pbixsLGgpLDE9PT1hLnN0YXRlLndyYXA/YS5hZGxlcj1kKGEuYWRsZXIsbyxsLGgpOjI9PT1hLnN0YXRlLndyYXAmJihhLmFkbGVyPXAoYS5hZGxlcixvLGwsaCkpLGEubmV4dF9pbis9bCxhLnRvdGFsX2luKz1sLGwpLGUubG9va2FoZWFkKz1yLGUubG9va2FoZWFkK2UuaW5zZXJ0Pj14KWZvcihzPWUuc3Ryc3RhcnQtZS5pbnNlcnQsZS5pbnNfaD1lLndpbmRvd1tzXSxlLmluc19oPShlLmluc19oPDxlLmhhc2hfc2hpZnReZS53aW5kb3dbcysxXSkmZS5oYXNoX21hc2s7ZS5pbnNlcnQmJihlLmluc19oPShlLmluc19oPDxlLmhhc2hfc2hpZnReZS53aW5kb3dbcyt4LTFdKSZlLmhhc2hfbWFzayxlLnByZXZbcyZlLndfbWFza109ZS5oZWFkW2UuaW5zX2hdLGUuaGVhZFtlLmluc19oXT1zLHMrKyxlLmluc2VydC0tLCEoZS5sb29rYWhlYWQrZS5pbnNlcnQ8eCkpOyk7fXdoaWxlKGUubG9va2FoZWFkPHomJjAhPT1lLnN0cm0uYXZhaWxfaW4pfWZ1bmN0aW9uIFooZSx0KXtmb3IodmFyIHIsbjs7KXtpZihlLmxvb2thaGVhZDx6KXtpZihqKGUpLGUubG9va2FoZWFkPHomJnQ9PT1sKXJldHVybiBBO2lmKDA9PT1lLmxvb2thaGVhZClicmVha31pZihyPTAsZS5sb29rYWhlYWQ+PXgmJihlLmluc19oPShlLmluc19oPDxlLmhhc2hfc2hpZnReZS53aW5kb3dbZS5zdHJzdGFydCt4LTFdKSZlLmhhc2hfbWFzayxyPWUucHJldltlLnN0cnN0YXJ0JmUud19tYXNrXT1lLmhlYWRbZS5pbnNfaF0sZS5oZWFkW2UuaW5zX2hdPWUuc3Ryc3RhcnQpLDAhPT1yJiZlLnN0cnN0YXJ0LXI8PWUud19zaXplLXomJihlLm1hdGNoX2xlbmd0aD1MKGUscikpLGUubWF0Y2hfbGVuZ3RoPj14KWlmKG49dS5fdHJfdGFsbHkoZSxlLnN0cnN0YXJ0LWUubWF0Y2hfc3RhcnQsZS5tYXRjaF9sZW5ndGgteCksZS5sb29rYWhlYWQtPWUubWF0Y2hfbGVuZ3RoLGUubWF0Y2hfbGVuZ3RoPD1lLm1heF9sYXp5X21hdGNoJiZlLmxvb2thaGVhZD49eCl7Zm9yKGUubWF0Y2hfbGVuZ3RoLS07ZS5zdHJzdGFydCsrLGUuaW5zX2g9KGUuaW5zX2g8PGUuaGFzaF9zaGlmdF5lLndpbmRvd1tlLnN0cnN0YXJ0K3gtMV0pJmUuaGFzaF9tYXNrLHI9ZS5wcmV2W2Uuc3Ryc3RhcnQmZS53X21hc2tdPWUuaGVhZFtlLmluc19oXSxlLmhlYWRbZS5pbnNfaF09ZS5zdHJzdGFydCwwIT0tLWUubWF0Y2hfbGVuZ3RoOyk7ZS5zdHJzdGFydCsrfWVsc2UgZS5zdHJzdGFydCs9ZS5tYXRjaF9sZW5ndGgsZS5tYXRjaF9sZW5ndGg9MCxlLmluc19oPWUud2luZG93W2Uuc3Ryc3RhcnRdLGUuaW5zX2g9KGUuaW5zX2g8PGUuaGFzaF9zaGlmdF5lLndpbmRvd1tlLnN0cnN0YXJ0KzFdKSZlLmhhc2hfbWFzaztlbHNlIG49dS5fdHJfdGFsbHkoZSwwLGUud2luZG93W2Uuc3Ryc3RhcnRdKSxlLmxvb2thaGVhZC0tLGUuc3Ryc3RhcnQrKztpZihuJiYoTihlLCExKSwwPT09ZS5zdHJtLmF2YWlsX291dCkpcmV0dXJuIEF9cmV0dXJuIGUuaW5zZXJ0PWUuc3Ryc3RhcnQ8eC0xP2Uuc3Ryc3RhcnQ6eC0xLHQ9PT1mPyhOKGUsITApLDA9PT1lLnN0cm0uYXZhaWxfb3V0P086Qik6ZS5sYXN0X2xpdCYmKE4oZSwhMSksMD09PWUuc3RybS5hdmFpbF9vdXQpP0E6SX1mdW5jdGlvbiBXKGUsdCl7Zm9yKHZhciByLG4saTs7KXtpZihlLmxvb2thaGVhZDx6KXtpZihqKGUpLGUubG9va2FoZWFkPHomJnQ9PT1sKXJldHVybiBBO2lmKDA9PT1lLmxvb2thaGVhZClicmVha31pZihyPTAsZS5sb29rYWhlYWQ+PXgmJihlLmluc19oPShlLmluc19oPDxlLmhhc2hfc2hpZnReZS53aW5kb3dbZS5zdHJzdGFydCt4LTFdKSZlLmhhc2hfbWFzayxyPWUucHJldltlLnN0cnN0YXJ0JmUud19tYXNrXT1lLmhlYWRbZS5pbnNfaF0sZS5oZWFkW2UuaW5zX2hdPWUuc3Ryc3RhcnQpLGUucHJldl9sZW5ndGg9ZS5tYXRjaF9sZW5ndGgsZS5wcmV2X21hdGNoPWUubWF0Y2hfc3RhcnQsZS5tYXRjaF9sZW5ndGg9eC0xLDAhPT1yJiZlLnByZXZfbGVuZ3RoPGUubWF4X2xhenlfbWF0Y2gmJmUuc3Ryc3RhcnQtcjw9ZS53X3NpemUteiYmKGUubWF0Y2hfbGVuZ3RoPUwoZSxyKSxlLm1hdGNoX2xlbmd0aDw9NSYmKDE9PT1lLnN0cmF0ZWd5fHxlLm1hdGNoX2xlbmd0aD09PXgmJjQwOTY8ZS5zdHJzdGFydC1lLm1hdGNoX3N0YXJ0KSYmKGUubWF0Y2hfbGVuZ3RoPXgtMSkpLGUucHJldl9sZW5ndGg+PXgmJmUubWF0Y2hfbGVuZ3RoPD1lLnByZXZfbGVuZ3RoKXtmb3IoaT1lLnN0cnN0YXJ0K2UubG9va2FoZWFkLXgsbj11Ll90cl90YWxseShlLGUuc3Ryc3RhcnQtMS1lLnByZXZfbWF0Y2gsZS5wcmV2X2xlbmd0aC14KSxlLmxvb2thaGVhZC09ZS5wcmV2X2xlbmd0aC0xLGUucHJldl9sZW5ndGgtPTI7KytlLnN0cnN0YXJ0PD1pJiYoZS5pbnNfaD0oZS5pbnNfaDw8ZS5oYXNoX3NoaWZ0XmUud2luZG93W2Uuc3Ryc3RhcnQreC0xXSkmZS5oYXNoX21hc2sscj1lLnByZXZbZS5zdHJzdGFydCZlLndfbWFza109ZS5oZWFkW2UuaW5zX2hdLGUuaGVhZFtlLmluc19oXT1lLnN0cnN0YXJ0KSwwIT0tLWUucHJldl9sZW5ndGg7KTtpZihlLm1hdGNoX2F2YWlsYWJsZT0wLGUubWF0Y2hfbGVuZ3RoPXgtMSxlLnN0cnN0YXJ0KyssbiYmKE4oZSwhMSksMD09PWUuc3RybS5hdmFpbF9vdXQpKXJldHVybiBBfWVsc2UgaWYoZS5tYXRjaF9hdmFpbGFibGUpe2lmKChuPXUuX3RyX3RhbGx5KGUsMCxlLndpbmRvd1tlLnN0cnN0YXJ0LTFdKSkmJk4oZSwhMSksZS5zdHJzdGFydCsrLGUubG9va2FoZWFkLS0sMD09PWUuc3RybS5hdmFpbF9vdXQpcmV0dXJuIEF9ZWxzZSBlLm1hdGNoX2F2YWlsYWJsZT0xLGUuc3Ryc3RhcnQrKyxlLmxvb2thaGVhZC0tfXJldHVybiBlLm1hdGNoX2F2YWlsYWJsZSYmKG49dS5fdHJfdGFsbHkoZSwwLGUud2luZG93W2Uuc3Ryc3RhcnQtMV0pLGUubWF0Y2hfYXZhaWxhYmxlPTApLGUuaW5zZXJ0PWUuc3Ryc3RhcnQ8eC0xP2Uuc3Ryc3RhcnQ6eC0xLHQ9PT1mPyhOKGUsITApLDA9PT1lLnN0cm0uYXZhaWxfb3V0P086Qik6ZS5sYXN0X2xpdCYmKE4oZSwhMSksMD09PWUuc3RybS5hdmFpbF9vdXQpP0E6SX1mdW5jdGlvbiBNKGUsdCxyLG4saSl7dGhpcy5nb29kX2xlbmd0aD1lLHRoaXMubWF4X2xhenk9dCx0aGlzLm5pY2VfbGVuZ3RoPXIsdGhpcy5tYXhfY2hhaW49bix0aGlzLmZ1bmM9aX1mdW5jdGlvbiBIKCl7dGhpcy5zdHJtPW51bGwsdGhpcy5zdGF0dXM9MCx0aGlzLnBlbmRpbmdfYnVmPW51bGwsdGhpcy5wZW5kaW5nX2J1Zl9zaXplPTAsdGhpcy5wZW5kaW5nX291dD0wLHRoaXMucGVuZGluZz0wLHRoaXMud3JhcD0wLHRoaXMuZ3poZWFkPW51bGwsdGhpcy5nemluZGV4PTAsdGhpcy5tZXRob2Q9dix0aGlzLmxhc3RfZmx1c2g9LTEsdGhpcy53X3NpemU9MCx0aGlzLndfYml0cz0wLHRoaXMud19tYXNrPTAsdGhpcy53aW5kb3c9bnVsbCx0aGlzLndpbmRvd19zaXplPTAsdGhpcy5wcmV2PW51bGwsdGhpcy5oZWFkPW51bGwsdGhpcy5pbnNfaD0wLHRoaXMuaGFzaF9zaXplPTAsdGhpcy5oYXNoX2JpdHM9MCx0aGlzLmhhc2hfbWFzaz0wLHRoaXMuaGFzaF9zaGlmdD0wLHRoaXMuYmxvY2tfc3RhcnQ9MCx0aGlzLm1hdGNoX2xlbmd0aD0wLHRoaXMucHJldl9tYXRjaD0wLHRoaXMubWF0Y2hfYXZhaWxhYmxlPTAsdGhpcy5zdHJzdGFydD0wLHRoaXMubWF0Y2hfc3RhcnQ9MCx0aGlzLmxvb2thaGVhZD0wLHRoaXMucHJldl9sZW5ndGg9MCx0aGlzLm1heF9jaGFpbl9sZW5ndGg9MCx0aGlzLm1heF9sYXp5X21hdGNoPTAsdGhpcy5sZXZlbD0wLHRoaXMuc3RyYXRlZ3k9MCx0aGlzLmdvb2RfbWF0Y2g9MCx0aGlzLm5pY2VfbWF0Y2g9MCx0aGlzLmR5bl9sdHJlZT1uZXcgYy5CdWYxNigyKncpLHRoaXMuZHluX2R0cmVlPW5ldyBjLkJ1ZjE2KDIqKDIqYSsxKSksdGhpcy5ibF90cmVlPW5ldyBjLkJ1ZjE2KDIqKDIqbysxKSksRCh0aGlzLmR5bl9sdHJlZSksRCh0aGlzLmR5bl9kdHJlZSksRCh0aGlzLmJsX3RyZWUpLHRoaXMubF9kZXNjPW51bGwsdGhpcy5kX2Rlc2M9bnVsbCx0aGlzLmJsX2Rlc2M9bnVsbCx0aGlzLmJsX2NvdW50PW5ldyBjLkJ1ZjE2KGsrMSksdGhpcy5oZWFwPW5ldyBjLkJ1ZjE2KDIqcysxKSxEKHRoaXMuaGVhcCksdGhpcy5oZWFwX2xlbj0wLHRoaXMuaGVhcF9tYXg9MCx0aGlzLmRlcHRoPW5ldyBjLkJ1ZjE2KDIqcysxKSxEKHRoaXMuZGVwdGgpLHRoaXMubF9idWY9MCx0aGlzLmxpdF9idWZzaXplPTAsdGhpcy5sYXN0X2xpdD0wLHRoaXMuZF9idWY9MCx0aGlzLm9wdF9sZW49MCx0aGlzLnN0YXRpY19sZW49MCx0aGlzLm1hdGNoZXM9MCx0aGlzLmluc2VydD0wLHRoaXMuYmlfYnVmPTAsdGhpcy5iaV92YWxpZD0wfWZ1bmN0aW9uIEcoZSl7dmFyIHQ7cmV0dXJuIGUmJmUuc3RhdGU/KGUudG90YWxfaW49ZS50b3RhbF9vdXQ9MCxlLmRhdGFfdHlwZT1pLCh0PWUuc3RhdGUpLnBlbmRpbmc9MCx0LnBlbmRpbmdfb3V0PTAsdC53cmFwPDAmJih0LndyYXA9LXQud3JhcCksdC5zdGF0dXM9dC53cmFwP0M6RSxlLmFkbGVyPTI9PT10LndyYXA/MDoxLHQubGFzdF9mbHVzaD1sLHUuX3RyX2luaXQodCksbSk6UihlLF8pfWZ1bmN0aW9uIEsoZSl7dmFyIHQ9RyhlKTtyZXR1cm4gdD09PW0mJmZ1bmN0aW9uKGUpe2Uud2luZG93X3NpemU9MiplLndfc2l6ZSxEKGUuaGVhZCksZS5tYXhfbGF6eV9tYXRjaD1oW2UubGV2ZWxdLm1heF9sYXp5LGUuZ29vZF9tYXRjaD1oW2UubGV2ZWxdLmdvb2RfbGVuZ3RoLGUubmljZV9tYXRjaD1oW2UubGV2ZWxdLm5pY2VfbGVuZ3RoLGUubWF4X2NoYWluX2xlbmd0aD1oW2UubGV2ZWxdLm1heF9jaGFpbixlLnN0cnN0YXJ0PTAsZS5ibG9ja19zdGFydD0wLGUubG9va2FoZWFkPTAsZS5pbnNlcnQ9MCxlLm1hdGNoX2xlbmd0aD1lLnByZXZfbGVuZ3RoPXgtMSxlLm1hdGNoX2F2YWlsYWJsZT0wLGUuaW5zX2g9MH0oZS5zdGF0ZSksdH1mdW5jdGlvbiBZKGUsdCxyLG4saSxzKXtpZighZSlyZXR1cm4gXzt2YXIgYT0xO2lmKHQ9PT1nJiYodD02KSxuPDA/KGE9MCxuPS1uKToxNTxuJiYoYT0yLG4tPTE2KSxpPDF8fHk8aXx8ciE9PXZ8fG48OHx8MTU8bnx8dDwwfHw5PHR8fHM8MHx8YjxzKXJldHVybiBSKGUsXyk7OD09PW4mJihuPTkpO3ZhciBvPW5ldyBIO3JldHVybihlLnN0YXRlPW8pLnN0cm09ZSxvLndyYXA9YSxvLmd6aGVhZD1udWxsLG8ud19iaXRzPW4sby53X3NpemU9MTw8by53X2JpdHMsby53X21hc2s9by53X3NpemUtMSxvLmhhc2hfYml0cz1pKzcsby5oYXNoX3NpemU9MTw8by5oYXNoX2JpdHMsby5oYXNoX21hc2s9by5oYXNoX3NpemUtMSxvLmhhc2hfc2hpZnQ9fn4oKG8uaGFzaF9iaXRzK3gtMSkveCksby53aW5kb3c9bmV3IGMuQnVmOCgyKm8ud19zaXplKSxvLmhlYWQ9bmV3IGMuQnVmMTYoby5oYXNoX3NpemUpLG8ucHJldj1uZXcgYy5CdWYxNihvLndfc2l6ZSksby5saXRfYnVmc2l6ZT0xPDxpKzYsby5wZW5kaW5nX2J1Zl9zaXplPTQqby5saXRfYnVmc2l6ZSxvLnBlbmRpbmdfYnVmPW5ldyBjLkJ1Zjgoby5wZW5kaW5nX2J1Zl9zaXplKSxvLmRfYnVmPTEqby5saXRfYnVmc2l6ZSxvLmxfYnVmPTMqby5saXRfYnVmc2l6ZSxvLmxldmVsPXQsby5zdHJhdGVneT1zLG8ubWV0aG9kPXIsSyhlKX1oPVtuZXcgTSgwLDAsMCwwLGZ1bmN0aW9uKGUsdCl7dmFyIHI9NjU1MzU7Zm9yKHI+ZS5wZW5kaW5nX2J1Zl9zaXplLTUmJihyPWUucGVuZGluZ19idWZfc2l6ZS01KTs7KXtpZihlLmxvb2thaGVhZDw9MSl7aWYoaihlKSwwPT09ZS5sb29rYWhlYWQmJnQ9PT1sKXJldHVybiBBO2lmKDA9PT1lLmxvb2thaGVhZClicmVha31lLnN0cnN0YXJ0Kz1lLmxvb2thaGVhZCxlLmxvb2thaGVhZD0wO3ZhciBuPWUuYmxvY2tfc3RhcnQrcjtpZigoMD09PWUuc3Ryc3RhcnR8fGUuc3Ryc3RhcnQ+PW4pJiYoZS5sb29rYWhlYWQ9ZS5zdHJzdGFydC1uLGUuc3Ryc3RhcnQ9bixOKGUsITEpLDA9PT1lLnN0cm0uYXZhaWxfb3V0KSlyZXR1cm4gQTtpZihlLnN0cnN0YXJ0LWUuYmxvY2tfc3RhcnQ+PWUud19zaXplLXomJihOKGUsITEpLDA9PT1lLnN0cm0uYXZhaWxfb3V0KSlyZXR1cm4gQX1yZXR1cm4gZS5pbnNlcnQ9MCx0PT09Zj8oTihlLCEwKSwwPT09ZS5zdHJtLmF2YWlsX291dD9POkIpOihlLnN0cnN0YXJ0PmUuYmxvY2tfc3RhcnQmJihOKGUsITEpLGUuc3RybS5hdmFpbF9vdXQpLEEpfSksbmV3IE0oNCw0LDgsNCxaKSxuZXcgTSg0LDUsMTYsOCxaKSxuZXcgTSg0LDYsMzIsMzIsWiksbmV3IE0oNCw0LDE2LDE2LFcpLG5ldyBNKDgsMTYsMzIsMzIsVyksbmV3IE0oOCwxNiwxMjgsMTI4LFcpLG5ldyBNKDgsMzIsMTI4LDI1NixXKSxuZXcgTSgzMiwxMjgsMjU4LDEwMjQsVyksbmV3IE0oMzIsMjU4LDI1OCw0MDk2LFcpXSxyLmRlZmxhdGVJbml0PWZ1bmN0aW9uKGUsdCl7cmV0dXJuIFkoZSx0LHYsMTUsOCwwKX0sci5kZWZsYXRlSW5pdDI9WSxyLmRlZmxhdGVSZXNldD1LLHIuZGVmbGF0ZVJlc2V0S2VlcD1HLHIuZGVmbGF0ZVNldEhlYWRlcj1mdW5jdGlvbihlLHQpe3JldHVybiBlJiZlLnN0YXRlPzIhPT1lLnN0YXRlLndyYXA/XzooZS5zdGF0ZS5nemhlYWQ9dCxtKTpffSxyLmRlZmxhdGU9ZnVuY3Rpb24oZSx0KXt2YXIgcixuLGkscztpZighZXx8IWUuc3RhdGV8fDU8dHx8dDwwKXJldHVybiBlP1IoZSxfKTpfO2lmKG49ZS5zdGF0ZSwhZS5vdXRwdXR8fCFlLmlucHV0JiYwIT09ZS5hdmFpbF9pbnx8NjY2PT09bi5zdGF0dXMmJnQhPT1mKXJldHVybiBSKGUsMD09PWUuYXZhaWxfb3V0Py01Ol8pO2lmKG4uc3RybT1lLHI9bi5sYXN0X2ZsdXNoLG4ubGFzdF9mbHVzaD10LG4uc3RhdHVzPT09QylpZigyPT09bi53cmFwKWUuYWRsZXI9MCxVKG4sMzEpLFUobiwxMzkpLFUobiw4KSxuLmd6aGVhZD8oVShuLChuLmd6aGVhZC50ZXh0PzE6MCkrKG4uZ3poZWFkLmhjcmM/MjowKSsobi5nemhlYWQuZXh0cmE/NDowKSsobi5nemhlYWQubmFtZT84OjApKyhuLmd6aGVhZC5jb21tZW50PzE2OjApKSxVKG4sMjU1Jm4uZ3poZWFkLnRpbWUpLFUobixuLmd6aGVhZC50aW1lPj44JjI1NSksVShuLG4uZ3poZWFkLnRpbWU+PjE2JjI1NSksVShuLG4uZ3poZWFkLnRpbWU+PjI0JjI1NSksVShuLDk9PT1uLmxldmVsPzI6Mjw9bi5zdHJhdGVneXx8bi5sZXZlbDwyPzQ6MCksVShuLDI1NSZuLmd6aGVhZC5vcyksbi5nemhlYWQuZXh0cmEmJm4uZ3poZWFkLmV4dHJhLmxlbmd0aCYmKFUobiwyNTUmbi5nemhlYWQuZXh0cmEubGVuZ3RoKSxVKG4sbi5nemhlYWQuZXh0cmEubGVuZ3RoPj44JjI1NSkpLG4uZ3poZWFkLmhjcmMmJihlLmFkbGVyPXAoZS5hZGxlcixuLnBlbmRpbmdfYnVmLG4ucGVuZGluZywwKSksbi5nemluZGV4PTAsbi5zdGF0dXM9NjkpOihVKG4sMCksVShuLDApLFUobiwwKSxVKG4sMCksVShuLDApLFUobiw5PT09bi5sZXZlbD8yOjI8PW4uc3RyYXRlZ3l8fG4ubGV2ZWw8Mj80OjApLFUobiwzKSxuLnN0YXR1cz1FKTtlbHNle3ZhciBhPXYrKG4ud19iaXRzLTg8PDQpPDw4O2F8PSgyPD1uLnN0cmF0ZWd5fHxuLmxldmVsPDI/MDpuLmxldmVsPDY/MTo2PT09bi5sZXZlbD8yOjMpPDw2LDAhPT1uLnN0cnN0YXJ0JiYoYXw9MzIpLGErPTMxLWElMzEsbi5zdGF0dXM9RSxQKG4sYSksMCE9PW4uc3Ryc3RhcnQmJihQKG4sZS5hZGxlcj4+PjE2KSxQKG4sNjU1MzUmZS5hZGxlcikpLGUuYWRsZXI9MX1pZig2OT09PW4uc3RhdHVzKWlmKG4uZ3poZWFkLmV4dHJhKXtmb3IoaT1uLnBlbmRpbmc7bi5nemluZGV4PCg2NTUzNSZuLmd6aGVhZC5leHRyYS5sZW5ndGgpJiYobi5wZW5kaW5nIT09bi5wZW5kaW5nX2J1Zl9zaXplfHwobi5nemhlYWQuaGNyYyYmbi5wZW5kaW5nPmkmJihlLmFkbGVyPXAoZS5hZGxlcixuLnBlbmRpbmdfYnVmLG4ucGVuZGluZy1pLGkpKSxGKGUpLGk9bi5wZW5kaW5nLG4ucGVuZGluZyE9PW4ucGVuZGluZ19idWZfc2l6ZSkpOylVKG4sMjU1Jm4uZ3poZWFkLmV4dHJhW24uZ3ppbmRleF0pLG4uZ3ppbmRleCsrO24uZ3poZWFkLmhjcmMmJm4ucGVuZGluZz5pJiYoZS5hZGxlcj1wKGUuYWRsZXIsbi5wZW5kaW5nX2J1ZixuLnBlbmRpbmctaSxpKSksbi5nemluZGV4PT09bi5nemhlYWQuZXh0cmEubGVuZ3RoJiYobi5nemluZGV4PTAsbi5zdGF0dXM9NzMpfWVsc2Ugbi5zdGF0dXM9NzM7aWYoNzM9PT1uLnN0YXR1cylpZihuLmd6aGVhZC5uYW1lKXtpPW4ucGVuZGluZztkb3tpZihuLnBlbmRpbmc9PT1uLnBlbmRpbmdfYnVmX3NpemUmJihuLmd6aGVhZC5oY3JjJiZuLnBlbmRpbmc+aSYmKGUuYWRsZXI9cChlLmFkbGVyLG4ucGVuZGluZ19idWYsbi5wZW5kaW5nLWksaSkpLEYoZSksaT1uLnBlbmRpbmcsbi5wZW5kaW5nPT09bi5wZW5kaW5nX2J1Zl9zaXplKSl7cz0xO2JyZWFrfXM9bi5nemluZGV4PG4uZ3poZWFkLm5hbWUubGVuZ3RoPzI1NSZuLmd6aGVhZC5uYW1lLmNoYXJDb2RlQXQobi5nemluZGV4KyspOjAsVShuLHMpfXdoaWxlKDAhPT1zKTtuLmd6aGVhZC5oY3JjJiZuLnBlbmRpbmc+aSYmKGUuYWRsZXI9cChlLmFkbGVyLG4ucGVuZGluZ19idWYsbi5wZW5kaW5nLWksaSkpLDA9PT1zJiYobi5nemluZGV4PTAsbi5zdGF0dXM9OTEpfWVsc2Ugbi5zdGF0dXM9OTE7aWYoOTE9PT1uLnN0YXR1cylpZihuLmd6aGVhZC5jb21tZW50KXtpPW4ucGVuZGluZztkb3tpZihuLnBlbmRpbmc9PT1uLnBlbmRpbmdfYnVmX3NpemUmJihuLmd6aGVhZC5oY3JjJiZuLnBlbmRpbmc+aSYmKGUuYWRsZXI9cChlLmFkbGVyLG4ucGVuZGluZ19idWYsbi5wZW5kaW5nLWksaSkpLEYoZSksaT1uLnBlbmRpbmcsbi5wZW5kaW5nPT09bi5wZW5kaW5nX2J1Zl9zaXplKSl7cz0xO2JyZWFrfXM9bi5nemluZGV4PG4uZ3poZWFkLmNvbW1lbnQubGVuZ3RoPzI1NSZuLmd6aGVhZC5jb21tZW50LmNoYXJDb2RlQXQobi5nemluZGV4KyspOjAsVShuLHMpfXdoaWxlKDAhPT1zKTtuLmd6aGVhZC5oY3JjJiZuLnBlbmRpbmc+aSYmKGUuYWRsZXI9cChlLmFkbGVyLG4ucGVuZGluZ19idWYsbi5wZW5kaW5nLWksaSkpLDA9PT1zJiYobi5zdGF0dXM9MTAzKX1lbHNlIG4uc3RhdHVzPTEwMztpZigxMDM9PT1uLnN0YXR1cyYmKG4uZ3poZWFkLmhjcmM/KG4ucGVuZGluZysyPm4ucGVuZGluZ19idWZfc2l6ZSYmRihlKSxuLnBlbmRpbmcrMjw9bi5wZW5kaW5nX2J1Zl9zaXplJiYoVShuLDI1NSZlLmFkbGVyKSxVKG4sZS5hZGxlcj4+OCYyNTUpLGUuYWRsZXI9MCxuLnN0YXR1cz1FKSk6bi5zdGF0dXM9RSksMCE9PW4ucGVuZGluZyl7aWYoRihlKSwwPT09ZS5hdmFpbF9vdXQpcmV0dXJuIG4ubGFzdF9mbHVzaD0tMSxtfWVsc2UgaWYoMD09PWUuYXZhaWxfaW4mJlQodCk8PVQocikmJnQhPT1mKXJldHVybiBSKGUsLTUpO2lmKDY2Nj09PW4uc3RhdHVzJiYwIT09ZS5hdmFpbF9pbilyZXR1cm4gUihlLC01KTtpZigwIT09ZS5hdmFpbF9pbnx8MCE9PW4ubG9va2FoZWFkfHx0IT09bCYmNjY2IT09bi5zdGF0dXMpe3ZhciBvPTI9PT1uLnN0cmF0ZWd5P2Z1bmN0aW9uKGUsdCl7Zm9yKHZhciByOzspe2lmKDA9PT1lLmxvb2thaGVhZCYmKGooZSksMD09PWUubG9va2FoZWFkKSl7aWYodD09PWwpcmV0dXJuIEE7YnJlYWt9aWYoZS5tYXRjaF9sZW5ndGg9MCxyPXUuX3RyX3RhbGx5KGUsMCxlLndpbmRvd1tlLnN0cnN0YXJ0XSksZS5sb29rYWhlYWQtLSxlLnN0cnN0YXJ0KyssciYmKE4oZSwhMSksMD09PWUuc3RybS5hdmFpbF9vdXQpKXJldHVybiBBfXJldHVybiBlLmluc2VydD0wLHQ9PT1mPyhOKGUsITApLDA9PT1lLnN0cm0uYXZhaWxfb3V0P086Qik6ZS5sYXN0X2xpdCYmKE4oZSwhMSksMD09PWUuc3RybS5hdmFpbF9vdXQpP0E6SX0obix0KTozPT09bi5zdHJhdGVneT9mdW5jdGlvbihlLHQpe2Zvcih2YXIgcixuLGkscyxhPWUud2luZG93Ozspe2lmKGUubG9va2FoZWFkPD1TKXtpZihqKGUpLGUubG9va2FoZWFkPD1TJiZ0PT09bClyZXR1cm4gQTtpZigwPT09ZS5sb29rYWhlYWQpYnJlYWt9aWYoZS5tYXRjaF9sZW5ndGg9MCxlLmxvb2thaGVhZD49eCYmMDxlLnN0cnN0YXJ0JiYobj1hW2k9ZS5zdHJzdGFydC0xXSk9PT1hWysraV0mJm49PT1hWysraV0mJm49PT1hWysraV0pe3M9ZS5zdHJzdGFydCtTO2Rve313aGlsZShuPT09YVsrK2ldJiZuPT09YVsrK2ldJiZuPT09YVsrK2ldJiZuPT09YVsrK2ldJiZuPT09YVsrK2ldJiZuPT09YVsrK2ldJiZuPT09YVsrK2ldJiZuPT09YVsrK2ldJiZpPHMpO2UubWF0Y2hfbGVuZ3RoPVMtKHMtaSksZS5tYXRjaF9sZW5ndGg+ZS5sb29rYWhlYWQmJihlLm1hdGNoX2xlbmd0aD1lLmxvb2thaGVhZCl9aWYoZS5tYXRjaF9sZW5ndGg+PXg/KHI9dS5fdHJfdGFsbHkoZSwxLGUubWF0Y2hfbGVuZ3RoLXgpLGUubG9va2FoZWFkLT1lLm1hdGNoX2xlbmd0aCxlLnN0cnN0YXJ0Kz1lLm1hdGNoX2xlbmd0aCxlLm1hdGNoX2xlbmd0aD0wKToocj11Ll90cl90YWxseShlLDAsZS53aW5kb3dbZS5zdHJzdGFydF0pLGUubG9va2FoZWFkLS0sZS5zdHJzdGFydCsrKSxyJiYoTihlLCExKSwwPT09ZS5zdHJtLmF2YWlsX291dCkpcmV0dXJuIEF9cmV0dXJuIGUuaW5zZXJ0PTAsdD09PWY/KE4oZSwhMCksMD09PWUuc3RybS5hdmFpbF9vdXQ/TzpCKTplLmxhc3RfbGl0JiYoTihlLCExKSwwPT09ZS5zdHJtLmF2YWlsX291dCk/QTpJfShuLHQpOmhbbi5sZXZlbF0uZnVuYyhuLHQpO2lmKG8hPT1PJiZvIT09Qnx8KG4uc3RhdHVzPTY2Niksbz09PUF8fG89PT1PKXJldHVybiAwPT09ZS5hdmFpbF9vdXQmJihuLmxhc3RfZmx1c2g9LTEpLG07aWYobz09PUkmJigxPT09dD91Ll90cl9hbGlnbihuKTo1IT09dCYmKHUuX3RyX3N0b3JlZF9ibG9jayhuLDAsMCwhMSksMz09PXQmJihEKG4uaGVhZCksMD09PW4ubG9va2FoZWFkJiYobi5zdHJzdGFydD0wLG4uYmxvY2tfc3RhcnQ9MCxuLmluc2VydD0wKSkpLEYoZSksMD09PWUuYXZhaWxfb3V0KSlyZXR1cm4gbi5sYXN0X2ZsdXNoPS0xLG19cmV0dXJuIHQhPT1mP206bi53cmFwPD0wPzE6KDI9PT1uLndyYXA/KFUobiwyNTUmZS5hZGxlciksVShuLGUuYWRsZXI+PjgmMjU1KSxVKG4sZS5hZGxlcj4+MTYmMjU1KSxVKG4sZS5hZGxlcj4+MjQmMjU1KSxVKG4sMjU1JmUudG90YWxfaW4pLFUobixlLnRvdGFsX2luPj44JjI1NSksVShuLGUudG90YWxfaW4+PjE2JjI1NSksVShuLGUudG90YWxfaW4+PjI0JjI1NSkpOihQKG4sZS5hZGxlcj4+PjE2KSxQKG4sNjU1MzUmZS5hZGxlcikpLEYoZSksMDxuLndyYXAmJihuLndyYXA9LW4ud3JhcCksMCE9PW4ucGVuZGluZz9tOjEpfSxyLmRlZmxhdGVFbmQ9ZnVuY3Rpb24oZSl7dmFyIHQ7cmV0dXJuIGUmJmUuc3RhdGU/KHQ9ZS5zdGF0ZS5zdGF0dXMpIT09QyYmNjkhPT10JiY3MyE9PXQmJjkxIT09dCYmMTAzIT09dCYmdCE9PUUmJjY2NiE9PXQ/UihlLF8pOihlLnN0YXRlPW51bGwsdD09PUU/UihlLC0zKTptKTpffSxyLmRlZmxhdGVTZXREaWN0aW9uYXJ5PWZ1bmN0aW9uKGUsdCl7dmFyIHIsbixpLHMsYSxvLGgsdSxsPXQubGVuZ3RoO2lmKCFlfHwhZS5zdGF0ZSlyZXR1cm4gXztpZigyPT09KHM9KHI9ZS5zdGF0ZSkud3JhcCl8fDE9PT1zJiZyLnN0YXR1cyE9PUN8fHIubG9va2FoZWFkKXJldHVybiBfO2ZvcigxPT09cyYmKGUuYWRsZXI9ZChlLmFkbGVyLHQsbCwwKSksci53cmFwPTAsbD49ci53X3NpemUmJigwPT09cyYmKEQoci5oZWFkKSxyLnN0cnN0YXJ0PTAsci5ibG9ja19zdGFydD0wLHIuaW5zZXJ0PTApLHU9bmV3IGMuQnVmOChyLndfc2l6ZSksYy5hcnJheVNldCh1LHQsbC1yLndfc2l6ZSxyLndfc2l6ZSwwKSx0PXUsbD1yLndfc2l6ZSksYT1lLmF2YWlsX2luLG89ZS5uZXh0X2luLGg9ZS5pbnB1dCxlLmF2YWlsX2luPWwsZS5uZXh0X2luPTAsZS5pbnB1dD10LGoocik7ci5sb29rYWhlYWQ+PXg7KXtmb3Iobj1yLnN0cnN0YXJ0LGk9ci5sb29rYWhlYWQtKHgtMSk7ci5pbnNfaD0oci5pbnNfaDw8ci5oYXNoX3NoaWZ0XnIud2luZG93W24reC0xXSkmci5oYXNoX21hc2ssci5wcmV2W24mci53X21hc2tdPXIuaGVhZFtyLmluc19oXSxyLmhlYWRbci5pbnNfaF09bixuKyssLS1pOyk7ci5zdHJzdGFydD1uLHIubG9va2FoZWFkPXgtMSxqKHIpfXJldHVybiByLnN0cnN0YXJ0Kz1yLmxvb2thaGVhZCxyLmJsb2NrX3N0YXJ0PXIuc3Ryc3RhcnQsci5pbnNlcnQ9ci5sb29rYWhlYWQsci5sb29rYWhlYWQ9MCxyLm1hdGNoX2xlbmd0aD1yLnByZXZfbGVuZ3RoPXgtMSxyLm1hdGNoX2F2YWlsYWJsZT0wLGUubmV4dF9pbj1vLGUuaW5wdXQ9aCxlLmF2YWlsX2luPWEsci53cmFwPXMsbX0sci5kZWZsYXRlSW5mbz1cInBha28gZGVmbGF0ZSAoZnJvbSBOb2RlY2EgcHJvamVjdClcIn0se1wiLi4vdXRpbHMvY29tbW9uXCI6NDEsXCIuL2FkbGVyMzJcIjo0MyxcIi4vY3JjMzJcIjo0NSxcIi4vbWVzc2FnZXNcIjo1MSxcIi4vdHJlZXNcIjo1Mn1dLDQ3OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dC5leHBvcnRzPWZ1bmN0aW9uKCl7dGhpcy50ZXh0PTAsdGhpcy50aW1lPTAsdGhpcy54ZmxhZ3M9MCx0aGlzLm9zPTAsdGhpcy5leHRyYT1udWxsLHRoaXMuZXh0cmFfbGVuPTAsdGhpcy5uYW1lPVwiXCIsdGhpcy5jb21tZW50PVwiXCIsdGhpcy5oY3JjPTAsdGhpcy5kb25lPSExfX0se31dLDQ4OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dC5leHBvcnRzPWZ1bmN0aW9uKGUsdCl7dmFyIHIsbixpLHMsYSxvLGgsdSxsLGYsYyxkLHAsbSxfLGcsYix2LHksdyxrLHgsUyx6LEM7cj1lLnN0YXRlLG49ZS5uZXh0X2luLHo9ZS5pbnB1dCxpPW4rKGUuYXZhaWxfaW4tNSkscz1lLm5leHRfb3V0LEM9ZS5vdXRwdXQsYT1zLSh0LWUuYXZhaWxfb3V0KSxvPXMrKGUuYXZhaWxfb3V0LTI1NyksaD1yLmRtYXgsdT1yLndzaXplLGw9ci53aGF2ZSxmPXIud25leHQsYz1yLndpbmRvdyxkPXIuaG9sZCxwPXIuYml0cyxtPXIubGVuY29kZSxfPXIuZGlzdGNvZGUsZz0oMTw8ci5sZW5iaXRzKS0xLGI9KDE8PHIuZGlzdGJpdHMpLTE7ZTpkb3twPDE1JiYoZCs9eltuKytdPDxwLHArPTgsZCs9eltuKytdPDxwLHArPTgpLHY9bVtkJmddO3Q6Zm9yKDs7KXtpZihkPj4+PXk9dj4+PjI0LHAtPXksMD09PSh5PXY+Pj4xNiYyNTUpKUNbcysrXT02NTUzNSZ2O2Vsc2V7aWYoISgxNiZ5KSl7aWYoMD09KDY0JnkpKXt2PW1bKDY1NTM1JnYpKyhkJigxPDx5KS0xKV07Y29udGludWUgdH1pZigzMiZ5KXtyLm1vZGU9MTI7YnJlYWsgZX1lLm1zZz1cImludmFsaWQgbGl0ZXJhbC9sZW5ndGggY29kZVwiLHIubW9kZT0zMDticmVhayBlfXc9NjU1MzUmdiwoeSY9MTUpJiYocDx5JiYoZCs9eltuKytdPDxwLHArPTgpLHcrPWQmKDE8PHkpLTEsZD4+Pj15LHAtPXkpLHA8MTUmJihkKz16W24rK108PHAscCs9OCxkKz16W24rK108PHAscCs9OCksdj1fW2QmYl07cjpmb3IoOzspe2lmKGQ+Pj49eT12Pj4+MjQscC09eSwhKDE2Jih5PXY+Pj4xNiYyNTUpKSl7aWYoMD09KDY0JnkpKXt2PV9bKDY1NTM1JnYpKyhkJigxPDx5KS0xKV07Y29udGludWUgcn1lLm1zZz1cImludmFsaWQgZGlzdGFuY2UgY29kZVwiLHIubW9kZT0zMDticmVhayBlfWlmKGs9NjU1MzUmdixwPCh5Jj0xNSkmJihkKz16W24rK108PHAsKHArPTgpPHkmJihkKz16W24rK108PHAscCs9OCkpLGg8KGsrPWQmKDE8PHkpLTEpKXtlLm1zZz1cImludmFsaWQgZGlzdGFuY2UgdG9vIGZhciBiYWNrXCIsci5tb2RlPTMwO2JyZWFrIGV9aWYoZD4+Pj15LHAtPXksKHk9cy1hKTxrKXtpZihsPCh5PWsteSkmJnIuc2FuZSl7ZS5tc2c9XCJpbnZhbGlkIGRpc3RhbmNlIHRvbyBmYXIgYmFja1wiLHIubW9kZT0zMDticmVhayBlfWlmKFM9YywoeD0wKT09PWYpe2lmKHgrPXUteSx5PHcpe2Zvcih3LT15O0NbcysrXT1jW3grK10sLS15Oyk7eD1zLWssUz1DfX1lbHNlIGlmKGY8eSl7aWYoeCs9dStmLXksKHktPWYpPHcpe2Zvcih3LT15O0NbcysrXT1jW3grK10sLS15Oyk7aWYoeD0wLGY8dyl7Zm9yKHctPXk9ZjtDW3MrK109Y1t4KytdLC0teTspO3g9cy1rLFM9Q319fWVsc2UgaWYoeCs9Zi15LHk8dyl7Zm9yKHctPXk7Q1tzKytdPWNbeCsrXSwtLXk7KTt4PXMtayxTPUN9Zm9yKDsyPHc7KUNbcysrXT1TW3grK10sQ1tzKytdPVNbeCsrXSxDW3MrK109U1t4KytdLHctPTM7dyYmKENbcysrXT1TW3grK10sMTx3JiYoQ1tzKytdPVNbeCsrXSkpfWVsc2V7Zm9yKHg9cy1rO0NbcysrXT1DW3grK10sQ1tzKytdPUNbeCsrXSxDW3MrK109Q1t4KytdLDI8KHctPTMpOyk7dyYmKENbcysrXT1DW3grK10sMTx3JiYoQ1tzKytdPUNbeCsrXSkpfWJyZWFrfX1icmVha319d2hpbGUobjxpJiZzPG8pO24tPXc9cD4+MyxkJj0oMTw8KHAtPXc8PDMpKS0xLGUubmV4dF9pbj1uLGUubmV4dF9vdXQ9cyxlLmF2YWlsX2luPW48aT9pLW4rNTo1LShuLWkpLGUuYXZhaWxfb3V0PXM8bz9vLXMrMjU3OjI1Ny0ocy1vKSxyLmhvbGQ9ZCxyLmJpdHM9cH19LHt9XSw0OTpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBJPWUoXCIuLi91dGlscy9jb21tb25cIiksTz1lKFwiLi9hZGxlcjMyXCIpLEI9ZShcIi4vY3JjMzJcIiksUj1lKFwiLi9pbmZmYXN0XCIpLFQ9ZShcIi4vaW5mdHJlZXNcIiksRD0xLEY9MixOPTAsVT0tMixQPTEsbj04NTIsaT01OTI7ZnVuY3Rpb24gTChlKXtyZXR1cm4oZT4+PjI0JjI1NSkrKGU+Pj44JjY1MjgwKSsoKDY1MjgwJmUpPDw4KSsoKDI1NSZlKTw8MjQpfWZ1bmN0aW9uIHMoKXt0aGlzLm1vZGU9MCx0aGlzLmxhc3Q9ITEsdGhpcy53cmFwPTAsdGhpcy5oYXZlZGljdD0hMSx0aGlzLmZsYWdzPTAsdGhpcy5kbWF4PTAsdGhpcy5jaGVjaz0wLHRoaXMudG90YWw9MCx0aGlzLmhlYWQ9bnVsbCx0aGlzLndiaXRzPTAsdGhpcy53c2l6ZT0wLHRoaXMud2hhdmU9MCx0aGlzLnduZXh0PTAsdGhpcy53aW5kb3c9bnVsbCx0aGlzLmhvbGQ9MCx0aGlzLmJpdHM9MCx0aGlzLmxlbmd0aD0wLHRoaXMub2Zmc2V0PTAsdGhpcy5leHRyYT0wLHRoaXMubGVuY29kZT1udWxsLHRoaXMuZGlzdGNvZGU9bnVsbCx0aGlzLmxlbmJpdHM9MCx0aGlzLmRpc3RiaXRzPTAsdGhpcy5uY29kZT0wLHRoaXMubmxlbj0wLHRoaXMubmRpc3Q9MCx0aGlzLmhhdmU9MCx0aGlzLm5leHQ9bnVsbCx0aGlzLmxlbnM9bmV3IEkuQnVmMTYoMzIwKSx0aGlzLndvcms9bmV3IEkuQnVmMTYoMjg4KSx0aGlzLmxlbmR5bj1udWxsLHRoaXMuZGlzdGR5bj1udWxsLHRoaXMuc2FuZT0wLHRoaXMuYmFjaz0wLHRoaXMud2FzPTB9ZnVuY3Rpb24gYShlKXt2YXIgdDtyZXR1cm4gZSYmZS5zdGF0ZT8odD1lLnN0YXRlLGUudG90YWxfaW49ZS50b3RhbF9vdXQ9dC50b3RhbD0wLGUubXNnPVwiXCIsdC53cmFwJiYoZS5hZGxlcj0xJnQud3JhcCksdC5tb2RlPVAsdC5sYXN0PTAsdC5oYXZlZGljdD0wLHQuZG1heD0zMjc2OCx0LmhlYWQ9bnVsbCx0LmhvbGQ9MCx0LmJpdHM9MCx0LmxlbmNvZGU9dC5sZW5keW49bmV3IEkuQnVmMzIobiksdC5kaXN0Y29kZT10LmRpc3RkeW49bmV3IEkuQnVmMzIoaSksdC5zYW5lPTEsdC5iYWNrPS0xLE4pOlV9ZnVuY3Rpb24gbyhlKXt2YXIgdDtyZXR1cm4gZSYmZS5zdGF0ZT8oKHQ9ZS5zdGF0ZSkud3NpemU9MCx0LndoYXZlPTAsdC53bmV4dD0wLGEoZSkpOlV9ZnVuY3Rpb24gaChlLHQpe3ZhciByLG47cmV0dXJuIGUmJmUuc3RhdGU/KG49ZS5zdGF0ZSx0PDA/KHI9MCx0PS10KToocj0xKyh0Pj40KSx0PDQ4JiYodCY9MTUpKSx0JiYodDw4fHwxNTx0KT9VOihudWxsIT09bi53aW5kb3cmJm4ud2JpdHMhPT10JiYobi53aW5kb3c9bnVsbCksbi53cmFwPXIsbi53Yml0cz10LG8oZSkpKTpVfWZ1bmN0aW9uIHUoZSx0KXt2YXIgcixuO3JldHVybiBlPyhuPW5ldyBzLChlLnN0YXRlPW4pLndpbmRvdz1udWxsLChyPWgoZSx0KSkhPT1OJiYoZS5zdGF0ZT1udWxsKSxyKTpVfXZhciBsLGYsYz0hMDtmdW5jdGlvbiBqKGUpe2lmKGMpe3ZhciB0O2ZvcihsPW5ldyBJLkJ1ZjMyKDUxMiksZj1uZXcgSS5CdWYzMigzMiksdD0wO3Q8MTQ0OyllLmxlbnNbdCsrXT04O2Zvcig7dDwyNTY7KWUubGVuc1t0KytdPTk7Zm9yKDt0PDI4MDspZS5sZW5zW3QrK109Nztmb3IoO3Q8Mjg4OyllLmxlbnNbdCsrXT04O2ZvcihUKEQsZS5sZW5zLDAsMjg4LGwsMCxlLndvcmsse2JpdHM6OX0pLHQ9MDt0PDMyOyllLmxlbnNbdCsrXT01O1QoRixlLmxlbnMsMCwzMixmLDAsZS53b3JrLHtiaXRzOjV9KSxjPSExfWUubGVuY29kZT1sLGUubGVuYml0cz05LGUuZGlzdGNvZGU9ZixlLmRpc3RiaXRzPTV9ZnVuY3Rpb24gWihlLHQscixuKXt2YXIgaSxzPWUuc3RhdGU7cmV0dXJuIG51bGw9PT1zLndpbmRvdyYmKHMud3NpemU9MTw8cy53Yml0cyxzLnduZXh0PTAscy53aGF2ZT0wLHMud2luZG93PW5ldyBJLkJ1Zjgocy53c2l6ZSkpLG4+PXMud3NpemU/KEkuYXJyYXlTZXQocy53aW5kb3csdCxyLXMud3NpemUscy53c2l6ZSwwKSxzLnduZXh0PTAscy53aGF2ZT1zLndzaXplKToobjwoaT1zLndzaXplLXMud25leHQpJiYoaT1uKSxJLmFycmF5U2V0KHMud2luZG93LHQsci1uLGkscy53bmV4dCksKG4tPWkpPyhJLmFycmF5U2V0KHMud2luZG93LHQsci1uLG4sMCkscy53bmV4dD1uLHMud2hhdmU9cy53c2l6ZSk6KHMud25leHQrPWkscy53bmV4dD09PXMud3NpemUmJihzLnduZXh0PTApLHMud2hhdmU8cy53c2l6ZSYmKHMud2hhdmUrPWkpKSksMH1yLmluZmxhdGVSZXNldD1vLHIuaW5mbGF0ZVJlc2V0Mj1oLHIuaW5mbGF0ZVJlc2V0S2VlcD1hLHIuaW5mbGF0ZUluaXQ9ZnVuY3Rpb24oZSl7cmV0dXJuIHUoZSwxNSl9LHIuaW5mbGF0ZUluaXQyPXUsci5pbmZsYXRlPWZ1bmN0aW9uKGUsdCl7dmFyIHIsbixpLHMsYSxvLGgsdSxsLGYsYyxkLHAsbSxfLGcsYix2LHksdyxrLHgsUyx6LEM9MCxFPW5ldyBJLkJ1ZjgoNCksQT1bMTYsMTcsMTgsMCw4LDcsOSw2LDEwLDUsMTEsNCwxMiwzLDEzLDIsMTQsMSwxNV07aWYoIWV8fCFlLnN0YXRlfHwhZS5vdXRwdXR8fCFlLmlucHV0JiYwIT09ZS5hdmFpbF9pbilyZXR1cm4gVTsxMj09PShyPWUuc3RhdGUpLm1vZGUmJihyLm1vZGU9MTMpLGE9ZS5uZXh0X291dCxpPWUub3V0cHV0LGg9ZS5hdmFpbF9vdXQscz1lLm5leHRfaW4sbj1lLmlucHV0LG89ZS5hdmFpbF9pbix1PXIuaG9sZCxsPXIuYml0cyxmPW8sYz1oLHg9TjtlOmZvcig7Oylzd2l0Y2goci5tb2RlKXtjYXNlIFA6aWYoMD09PXIud3JhcCl7ci5tb2RlPTEzO2JyZWFrfWZvcig7bDwxNjspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fWlmKDImci53cmFwJiYzNTYxNT09PXUpe0Vbci5jaGVjaz0wXT0yNTUmdSxFWzFdPXU+Pj44JjI1NSxyLmNoZWNrPUIoci5jaGVjayxFLDIsMCksbD11PTAsci5tb2RlPTI7YnJlYWt9aWYoci5mbGFncz0wLHIuaGVhZCYmKHIuaGVhZC5kb25lPSExKSwhKDEmci53cmFwKXx8KCgoMjU1JnUpPDw4KSsodT4+OCkpJTMxKXtlLm1zZz1cImluY29ycmVjdCBoZWFkZXIgY2hlY2tcIixyLm1vZGU9MzA7YnJlYWt9aWYoOCE9KDE1JnUpKXtlLm1zZz1cInVua25vd24gY29tcHJlc3Npb24gbWV0aG9kXCIsci5tb2RlPTMwO2JyZWFrfWlmKGwtPTQsaz04KygxNSYodT4+Pj00KSksMD09PXIud2JpdHMpci53Yml0cz1rO2Vsc2UgaWYoaz5yLndiaXRzKXtlLm1zZz1cImludmFsaWQgd2luZG93IHNpemVcIixyLm1vZGU9MzA7YnJlYWt9ci5kbWF4PTE8PGssZS5hZGxlcj1yLmNoZWNrPTEsci5tb2RlPTUxMiZ1PzEwOjEyLGw9dT0wO2JyZWFrO2Nhc2UgMjpmb3IoO2w8MTY7KXtpZigwPT09bylicmVhayBlO28tLSx1Kz1uW3MrK108PGwsbCs9OH1pZihyLmZsYWdzPXUsOCE9KDI1NSZyLmZsYWdzKSl7ZS5tc2c9XCJ1bmtub3duIGNvbXByZXNzaW9uIG1ldGhvZFwiLHIubW9kZT0zMDticmVha31pZig1NzM0NCZyLmZsYWdzKXtlLm1zZz1cInVua25vd24gaGVhZGVyIGZsYWdzIHNldFwiLHIubW9kZT0zMDticmVha31yLmhlYWQmJihyLmhlYWQudGV4dD11Pj44JjEpLDUxMiZyLmZsYWdzJiYoRVswXT0yNTUmdSxFWzFdPXU+Pj44JjI1NSxyLmNoZWNrPUIoci5jaGVjayxFLDIsMCkpLGw9dT0wLHIubW9kZT0zO2Nhc2UgMzpmb3IoO2w8MzI7KXtpZigwPT09bylicmVhayBlO28tLSx1Kz1uW3MrK108PGwsbCs9OH1yLmhlYWQmJihyLmhlYWQudGltZT11KSw1MTImci5mbGFncyYmKEVbMF09MjU1JnUsRVsxXT11Pj4+OCYyNTUsRVsyXT11Pj4+MTYmMjU1LEVbM109dT4+PjI0JjI1NSxyLmNoZWNrPUIoci5jaGVjayxFLDQsMCkpLGw9dT0wLHIubW9kZT00O2Nhc2UgNDpmb3IoO2w8MTY7KXtpZigwPT09bylicmVhayBlO28tLSx1Kz1uW3MrK108PGwsbCs9OH1yLmhlYWQmJihyLmhlYWQueGZsYWdzPTI1NSZ1LHIuaGVhZC5vcz11Pj44KSw1MTImci5mbGFncyYmKEVbMF09MjU1JnUsRVsxXT11Pj4+OCYyNTUsci5jaGVjaz1CKHIuY2hlY2ssRSwyLDApKSxsPXU9MCxyLm1vZGU9NTtjYXNlIDU6aWYoMTAyNCZyLmZsYWdzKXtmb3IoO2w8MTY7KXtpZigwPT09bylicmVhayBlO28tLSx1Kz1uW3MrK108PGwsbCs9OH1yLmxlbmd0aD11LHIuaGVhZCYmKHIuaGVhZC5leHRyYV9sZW49dSksNTEyJnIuZmxhZ3MmJihFWzBdPTI1NSZ1LEVbMV09dT4+PjgmMjU1LHIuY2hlY2s9QihyLmNoZWNrLEUsMiwwKSksbD11PTB9ZWxzZSByLmhlYWQmJihyLmhlYWQuZXh0cmE9bnVsbCk7ci5tb2RlPTY7Y2FzZSA2OmlmKDEwMjQmci5mbGFncyYmKG88KGQ9ci5sZW5ndGgpJiYoZD1vKSxkJiYoci5oZWFkJiYoaz1yLmhlYWQuZXh0cmFfbGVuLXIubGVuZ3RoLHIuaGVhZC5leHRyYXx8KHIuaGVhZC5leHRyYT1uZXcgQXJyYXkoci5oZWFkLmV4dHJhX2xlbikpLEkuYXJyYXlTZXQoci5oZWFkLmV4dHJhLG4scyxkLGspKSw1MTImci5mbGFncyYmKHIuY2hlY2s9QihyLmNoZWNrLG4sZCxzKSksby09ZCxzKz1kLHIubGVuZ3RoLT1kKSxyLmxlbmd0aCkpYnJlYWsgZTtyLmxlbmd0aD0wLHIubW9kZT03O2Nhc2UgNzppZigyMDQ4JnIuZmxhZ3Mpe2lmKDA9PT1vKWJyZWFrIGU7Zm9yKGQ9MDtrPW5bcytkKytdLHIuaGVhZCYmayYmci5sZW5ndGg8NjU1MzYmJihyLmhlYWQubmFtZSs9U3RyaW5nLmZyb21DaGFyQ29kZShrKSksayYmZDxvOyk7aWYoNTEyJnIuZmxhZ3MmJihyLmNoZWNrPUIoci5jaGVjayxuLGQscykpLG8tPWQscys9ZCxrKWJyZWFrIGV9ZWxzZSByLmhlYWQmJihyLmhlYWQubmFtZT1udWxsKTtyLmxlbmd0aD0wLHIubW9kZT04O2Nhc2UgODppZig0MDk2JnIuZmxhZ3Mpe2lmKDA9PT1vKWJyZWFrIGU7Zm9yKGQ9MDtrPW5bcytkKytdLHIuaGVhZCYmayYmci5sZW5ndGg8NjU1MzYmJihyLmhlYWQuY29tbWVudCs9U3RyaW5nLmZyb21DaGFyQ29kZShrKSksayYmZDxvOyk7aWYoNTEyJnIuZmxhZ3MmJihyLmNoZWNrPUIoci5jaGVjayxuLGQscykpLG8tPWQscys9ZCxrKWJyZWFrIGV9ZWxzZSByLmhlYWQmJihyLmhlYWQuY29tbWVudD1udWxsKTtyLm1vZGU9OTtjYXNlIDk6aWYoNTEyJnIuZmxhZ3Mpe2Zvcig7bDwxNjspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fWlmKHUhPT0oNjU1MzUmci5jaGVjaykpe2UubXNnPVwiaGVhZGVyIGNyYyBtaXNtYXRjaFwiLHIubW9kZT0zMDticmVha31sPXU9MH1yLmhlYWQmJihyLmhlYWQuaGNyYz1yLmZsYWdzPj45JjEsci5oZWFkLmRvbmU9ITApLGUuYWRsZXI9ci5jaGVjaz0wLHIubW9kZT0xMjticmVhaztjYXNlIDEwOmZvcig7bDwzMjspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fWUuYWRsZXI9ci5jaGVjaz1MKHUpLGw9dT0wLHIubW9kZT0xMTtjYXNlIDExOmlmKDA9PT1yLmhhdmVkaWN0KXJldHVybiBlLm5leHRfb3V0PWEsZS5hdmFpbF9vdXQ9aCxlLm5leHRfaW49cyxlLmF2YWlsX2luPW8sci5ob2xkPXUsci5iaXRzPWwsMjtlLmFkbGVyPXIuY2hlY2s9MSxyLm1vZGU9MTI7Y2FzZSAxMjppZig1PT09dHx8Nj09PXQpYnJlYWsgZTtjYXNlIDEzOmlmKHIubGFzdCl7dT4+Pj03JmwsbC09NyZsLHIubW9kZT0yNzticmVha31mb3IoO2w8Mzspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fXN3aXRjaChyLmxhc3Q9MSZ1LGwtPTEsMyYodT4+Pj0xKSl7Y2FzZSAwOnIubW9kZT0xNDticmVhaztjYXNlIDE6aWYoaihyKSxyLm1vZGU9MjAsNiE9PXQpYnJlYWs7dT4+Pj0yLGwtPTI7YnJlYWsgZTtjYXNlIDI6ci5tb2RlPTE3O2JyZWFrO2Nhc2UgMzplLm1zZz1cImludmFsaWQgYmxvY2sgdHlwZVwiLHIubW9kZT0zMH11Pj4+PTIsbC09MjticmVhaztjYXNlIDE0OmZvcih1Pj4+PTcmbCxsLT03Jmw7bDwzMjspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fWlmKCg2NTUzNSZ1KSE9KHU+Pj4xNl42NTUzNSkpe2UubXNnPVwiaW52YWxpZCBzdG9yZWQgYmxvY2sgbGVuZ3Roc1wiLHIubW9kZT0zMDticmVha31pZihyLmxlbmd0aD02NTUzNSZ1LGw9dT0wLHIubW9kZT0xNSw2PT09dClicmVhayBlO2Nhc2UgMTU6ci5tb2RlPTE2O2Nhc2UgMTY6aWYoZD1yLmxlbmd0aCl7aWYobzxkJiYoZD1vKSxoPGQmJihkPWgpLDA9PT1kKWJyZWFrIGU7SS5hcnJheVNldChpLG4scyxkLGEpLG8tPWQscys9ZCxoLT1kLGErPWQsci5sZW5ndGgtPWQ7YnJlYWt9ci5tb2RlPTEyO2JyZWFrO2Nhc2UgMTc6Zm9yKDtsPDE0Oyl7aWYoMD09PW8pYnJlYWsgZTtvLS0sdSs9bltzKytdPDxsLGwrPTh9aWYoci5ubGVuPTI1NysoMzEmdSksdT4+Pj01LGwtPTUsci5uZGlzdD0xKygzMSZ1KSx1Pj4+PTUsbC09NSxyLm5jb2RlPTQrKDE1JnUpLHU+Pj49NCxsLT00LDI4NjxyLm5sZW58fDMwPHIubmRpc3Qpe2UubXNnPVwidG9vIG1hbnkgbGVuZ3RoIG9yIGRpc3RhbmNlIHN5bWJvbHNcIixyLm1vZGU9MzA7YnJlYWt9ci5oYXZlPTAsci5tb2RlPTE4O2Nhc2UgMTg6Zm9yKDtyLmhhdmU8ci5uY29kZTspe2Zvcig7bDwzOyl7aWYoMD09PW8pYnJlYWsgZTtvLS0sdSs9bltzKytdPDxsLGwrPTh9ci5sZW5zW0Fbci5oYXZlKytdXT03JnUsdT4+Pj0zLGwtPTN9Zm9yKDtyLmhhdmU8MTk7KXIubGVuc1tBW3IuaGF2ZSsrXV09MDtpZihyLmxlbmNvZGU9ci5sZW5keW4sci5sZW5iaXRzPTcsUz17Yml0czpyLmxlbmJpdHN9LHg9VCgwLHIubGVucywwLDE5LHIubGVuY29kZSwwLHIud29yayxTKSxyLmxlbmJpdHM9Uy5iaXRzLHgpe2UubXNnPVwiaW52YWxpZCBjb2RlIGxlbmd0aHMgc2V0XCIsci5tb2RlPTMwO2JyZWFrfXIuaGF2ZT0wLHIubW9kZT0xOTtjYXNlIDE5OmZvcig7ci5oYXZlPHIubmxlbityLm5kaXN0Oyl7Zm9yKDtnPShDPXIubGVuY29kZVt1JigxPDxyLmxlbmJpdHMpLTFdKT4+PjE2JjI1NSxiPTY1NTM1JkMsISgoXz1DPj4+MjQpPD1sKTspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fWlmKGI8MTYpdT4+Pj1fLGwtPV8sci5sZW5zW3IuaGF2ZSsrXT1iO2Vsc2V7aWYoMTY9PT1iKXtmb3Ioej1fKzI7bDx6Oyl7aWYoMD09PW8pYnJlYWsgZTtvLS0sdSs9bltzKytdPDxsLGwrPTh9aWYodT4+Pj1fLGwtPV8sMD09PXIuaGF2ZSl7ZS5tc2c9XCJpbnZhbGlkIGJpdCBsZW5ndGggcmVwZWF0XCIsci5tb2RlPTMwO2JyZWFrfWs9ci5sZW5zW3IuaGF2ZS0xXSxkPTMrKDMmdSksdT4+Pj0yLGwtPTJ9ZWxzZSBpZigxNz09PWIpe2Zvcih6PV8rMztsPHo7KXtpZigwPT09bylicmVhayBlO28tLSx1Kz1uW3MrK108PGwsbCs9OH1sLT1fLGs9MCxkPTMrKDcmKHU+Pj49XykpLHU+Pj49MyxsLT0zfWVsc2V7Zm9yKHo9Xys3O2w8ejspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fWwtPV8saz0wLGQ9MTErKDEyNyYodT4+Pj1fKSksdT4+Pj03LGwtPTd9aWYoci5oYXZlK2Q+ci5ubGVuK3IubmRpc3Qpe2UubXNnPVwiaW52YWxpZCBiaXQgbGVuZ3RoIHJlcGVhdFwiLHIubW9kZT0zMDticmVha31mb3IoO2QtLTspci5sZW5zW3IuaGF2ZSsrXT1rfX1pZigzMD09PXIubW9kZSlicmVhaztpZigwPT09ci5sZW5zWzI1Nl0pe2UubXNnPVwiaW52YWxpZCBjb2RlIC0tIG1pc3NpbmcgZW5kLW9mLWJsb2NrXCIsci5tb2RlPTMwO2JyZWFrfWlmKHIubGVuYml0cz05LFM9e2JpdHM6ci5sZW5iaXRzfSx4PVQoRCxyLmxlbnMsMCxyLm5sZW4sci5sZW5jb2RlLDAsci53b3JrLFMpLHIubGVuYml0cz1TLmJpdHMseCl7ZS5tc2c9XCJpbnZhbGlkIGxpdGVyYWwvbGVuZ3RocyBzZXRcIixyLm1vZGU9MzA7YnJlYWt9aWYoci5kaXN0Yml0cz02LHIuZGlzdGNvZGU9ci5kaXN0ZHluLFM9e2JpdHM6ci5kaXN0Yml0c30seD1UKEYsci5sZW5zLHIubmxlbixyLm5kaXN0LHIuZGlzdGNvZGUsMCxyLndvcmssUyksci5kaXN0Yml0cz1TLmJpdHMseCl7ZS5tc2c9XCJpbnZhbGlkIGRpc3RhbmNlcyBzZXRcIixyLm1vZGU9MzA7YnJlYWt9aWYoci5tb2RlPTIwLDY9PT10KWJyZWFrIGU7Y2FzZSAyMDpyLm1vZGU9MjE7Y2FzZSAyMTppZig2PD1vJiYyNTg8PWgpe2UubmV4dF9vdXQ9YSxlLmF2YWlsX291dD1oLGUubmV4dF9pbj1zLGUuYXZhaWxfaW49byxyLmhvbGQ9dSxyLmJpdHM9bCxSKGUsYyksYT1lLm5leHRfb3V0LGk9ZS5vdXRwdXQsaD1lLmF2YWlsX291dCxzPWUubmV4dF9pbixuPWUuaW5wdXQsbz1lLmF2YWlsX2luLHU9ci5ob2xkLGw9ci5iaXRzLDEyPT09ci5tb2RlJiYoci5iYWNrPS0xKTticmVha31mb3Ioci5iYWNrPTA7Zz0oQz1yLmxlbmNvZGVbdSYoMTw8ci5sZW5iaXRzKS0xXSk+Pj4xNiYyNTUsYj02NTUzNSZDLCEoKF89Qz4+PjI0KTw9bCk7KXtpZigwPT09bylicmVhayBlO28tLSx1Kz1uW3MrK108PGwsbCs9OH1pZihnJiYwPT0oMjQwJmcpKXtmb3Iodj1fLHk9Zyx3PWI7Zz0oQz1yLmxlbmNvZGVbdysoKHUmKDE8PHYreSktMSk+PnYpXSk+Pj4xNiYyNTUsYj02NTUzNSZDLCEodisoXz1DPj4+MjQpPD1sKTspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fXU+Pj49dixsLT12LHIuYmFjays9dn1pZih1Pj4+PV8sbC09XyxyLmJhY2srPV8sci5sZW5ndGg9YiwwPT09Zyl7ci5tb2RlPTI2O2JyZWFrfWlmKDMyJmcpe3IuYmFjaz0tMSxyLm1vZGU9MTI7YnJlYWt9aWYoNjQmZyl7ZS5tc2c9XCJpbnZhbGlkIGxpdGVyYWwvbGVuZ3RoIGNvZGVcIixyLm1vZGU9MzA7YnJlYWt9ci5leHRyYT0xNSZnLHIubW9kZT0yMjtjYXNlIDIyOmlmKHIuZXh0cmEpe2Zvcih6PXIuZXh0cmE7bDx6Oyl7aWYoMD09PW8pYnJlYWsgZTtvLS0sdSs9bltzKytdPDxsLGwrPTh9ci5sZW5ndGgrPXUmKDE8PHIuZXh0cmEpLTEsdT4+Pj1yLmV4dHJhLGwtPXIuZXh0cmEsci5iYWNrKz1yLmV4dHJhfXIud2FzPXIubGVuZ3RoLHIubW9kZT0yMztjYXNlIDIzOmZvcig7Zz0oQz1yLmRpc3Rjb2RlW3UmKDE8PHIuZGlzdGJpdHMpLTFdKT4+PjE2JjI1NSxiPTY1NTM1JkMsISgoXz1DPj4+MjQpPD1sKTspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fWlmKDA9PSgyNDAmZykpe2Zvcih2PV8seT1nLHc9YjtnPShDPXIuZGlzdGNvZGVbdysoKHUmKDE8PHYreSktMSk+PnYpXSk+Pj4xNiYyNTUsYj02NTUzNSZDLCEodisoXz1DPj4+MjQpPD1sKTspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fXU+Pj49dixsLT12LHIuYmFjays9dn1pZih1Pj4+PV8sbC09XyxyLmJhY2srPV8sNjQmZyl7ZS5tc2c9XCJpbnZhbGlkIGRpc3RhbmNlIGNvZGVcIixyLm1vZGU9MzA7YnJlYWt9ci5vZmZzZXQ9YixyLmV4dHJhPTE1Jmcsci5tb2RlPTI0O2Nhc2UgMjQ6aWYoci5leHRyYSl7Zm9yKHo9ci5leHRyYTtsPHo7KXtpZigwPT09bylicmVhayBlO28tLSx1Kz1uW3MrK108PGwsbCs9OH1yLm9mZnNldCs9dSYoMTw8ci5leHRyYSktMSx1Pj4+PXIuZXh0cmEsbC09ci5leHRyYSxyLmJhY2srPXIuZXh0cmF9aWYoci5vZmZzZXQ+ci5kbWF4KXtlLm1zZz1cImludmFsaWQgZGlzdGFuY2UgdG9vIGZhciBiYWNrXCIsci5tb2RlPTMwO2JyZWFrfXIubW9kZT0yNTtjYXNlIDI1OmlmKDA9PT1oKWJyZWFrIGU7aWYoZD1jLWgsci5vZmZzZXQ+ZCl7aWYoKGQ9ci5vZmZzZXQtZCk+ci53aGF2ZSYmci5zYW5lKXtlLm1zZz1cImludmFsaWQgZGlzdGFuY2UgdG9vIGZhciBiYWNrXCIsci5tb2RlPTMwO2JyZWFrfXA9ZD5yLnduZXh0PyhkLT1yLnduZXh0LHIud3NpemUtZCk6ci53bmV4dC1kLGQ+ci5sZW5ndGgmJihkPXIubGVuZ3RoKSxtPXIud2luZG93fWVsc2UgbT1pLHA9YS1yLm9mZnNldCxkPXIubGVuZ3RoO2ZvcihoPGQmJihkPWgpLGgtPWQsci5sZW5ndGgtPWQ7aVthKytdPW1bcCsrXSwtLWQ7KTswPT09ci5sZW5ndGgmJihyLm1vZGU9MjEpO2JyZWFrO2Nhc2UgMjY6aWYoMD09PWgpYnJlYWsgZTtpW2ErK109ci5sZW5ndGgsaC0tLHIubW9kZT0yMTticmVhaztjYXNlIDI3OmlmKHIud3JhcCl7Zm9yKDtsPDMyOyl7aWYoMD09PW8pYnJlYWsgZTtvLS0sdXw9bltzKytdPDxsLGwrPTh9aWYoYy09aCxlLnRvdGFsX291dCs9YyxyLnRvdGFsKz1jLGMmJihlLmFkbGVyPXIuY2hlY2s9ci5mbGFncz9CKHIuY2hlY2ssaSxjLGEtYyk6TyhyLmNoZWNrLGksYyxhLWMpKSxjPWgsKHIuZmxhZ3M/dTpMKHUpKSE9PXIuY2hlY2spe2UubXNnPVwiaW5jb3JyZWN0IGRhdGEgY2hlY2tcIixyLm1vZGU9MzA7YnJlYWt9bD11PTB9ci5tb2RlPTI4O2Nhc2UgMjg6aWYoci53cmFwJiZyLmZsYWdzKXtmb3IoO2w8MzI7KXtpZigwPT09bylicmVhayBlO28tLSx1Kz1uW3MrK108PGwsbCs9OH1pZih1IT09KDQyOTQ5NjcyOTUmci50b3RhbCkpe2UubXNnPVwiaW5jb3JyZWN0IGxlbmd0aCBjaGVja1wiLHIubW9kZT0zMDticmVha31sPXU9MH1yLm1vZGU9Mjk7Y2FzZSAyOTp4PTE7YnJlYWsgZTtjYXNlIDMwOng9LTM7YnJlYWsgZTtjYXNlIDMxOnJldHVybi00O2Nhc2UgMzI6ZGVmYXVsdDpyZXR1cm4gVX1yZXR1cm4gZS5uZXh0X291dD1hLGUuYXZhaWxfb3V0PWgsZS5uZXh0X2luPXMsZS5hdmFpbF9pbj1vLHIuaG9sZD11LHIuYml0cz1sLChyLndzaXplfHxjIT09ZS5hdmFpbF9vdXQmJnIubW9kZTwzMCYmKHIubW9kZTwyN3x8NCE9PXQpKSYmWihlLGUub3V0cHV0LGUubmV4dF9vdXQsYy1lLmF2YWlsX291dCk/KHIubW9kZT0zMSwtNCk6KGYtPWUuYXZhaWxfaW4sYy09ZS5hdmFpbF9vdXQsZS50b3RhbF9pbis9ZixlLnRvdGFsX291dCs9YyxyLnRvdGFsKz1jLHIud3JhcCYmYyYmKGUuYWRsZXI9ci5jaGVjaz1yLmZsYWdzP0Ioci5jaGVjayxpLGMsZS5uZXh0X291dC1jKTpPKHIuY2hlY2ssaSxjLGUubmV4dF9vdXQtYykpLGUuZGF0YV90eXBlPXIuYml0cysoci5sYXN0PzY0OjApKygxMj09PXIubW9kZT8xMjg6MCkrKDIwPT09ci5tb2RlfHwxNT09PXIubW9kZT8yNTY6MCksKDA9PWYmJjA9PT1jfHw0PT09dCkmJng9PT1OJiYoeD0tNSkseCl9LHIuaW5mbGF0ZUVuZD1mdW5jdGlvbihlKXtpZighZXx8IWUuc3RhdGUpcmV0dXJuIFU7dmFyIHQ9ZS5zdGF0ZTtyZXR1cm4gdC53aW5kb3cmJih0LndpbmRvdz1udWxsKSxlLnN0YXRlPW51bGwsTn0sci5pbmZsYXRlR2V0SGVhZGVyPWZ1bmN0aW9uKGUsdCl7dmFyIHI7cmV0dXJuIGUmJmUuc3RhdGU/MD09KDImKHI9ZS5zdGF0ZSkud3JhcCk/VTooKHIuaGVhZD10KS5kb25lPSExLE4pOlV9LHIuaW5mbGF0ZVNldERpY3Rpb25hcnk9ZnVuY3Rpb24oZSx0KXt2YXIgcixuPXQubGVuZ3RoO3JldHVybiBlJiZlLnN0YXRlPzAhPT0ocj1lLnN0YXRlKS53cmFwJiYxMSE9PXIubW9kZT9VOjExPT09ci5tb2RlJiZPKDEsdCxuLDApIT09ci5jaGVjaz8tMzpaKGUsdCxuLG4pPyhyLm1vZGU9MzEsLTQpOihyLmhhdmVkaWN0PTEsTik6VX0sci5pbmZsYXRlSW5mbz1cInBha28gaW5mbGF0ZSAoZnJvbSBOb2RlY2EgcHJvamVjdClcIn0se1wiLi4vdXRpbHMvY29tbW9uXCI6NDEsXCIuL2FkbGVyMzJcIjo0MyxcIi4vY3JjMzJcIjo0NSxcIi4vaW5mZmFzdFwiOjQ4LFwiLi9pbmZ0cmVlc1wiOjUwfV0sNTA6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgRD1lKFwiLi4vdXRpbHMvY29tbW9uXCIpLEY9WzMsNCw1LDYsNyw4LDksMTAsMTEsMTMsMTUsMTcsMTksMjMsMjcsMzEsMzUsNDMsNTEsNTksNjcsODMsOTksMTE1LDEzMSwxNjMsMTk1LDIyNywyNTgsMCwwXSxOPVsxNiwxNiwxNiwxNiwxNiwxNiwxNiwxNiwxNywxNywxNywxNywxOCwxOCwxOCwxOCwxOSwxOSwxOSwxOSwyMCwyMCwyMCwyMCwyMSwyMSwyMSwyMSwxNiw3Miw3OF0sVT1bMSwyLDMsNCw1LDcsOSwxMywxNywyNSwzMyw0OSw2NSw5NywxMjksMTkzLDI1NywzODUsNTEzLDc2OSwxMDI1LDE1MzcsMjA0OSwzMDczLDQwOTcsNjE0NSw4MTkzLDEyMjg5LDE2Mzg1LDI0NTc3LDAsMF0sUD1bMTYsMTYsMTYsMTYsMTcsMTcsMTgsMTgsMTksMTksMjAsMjAsMjEsMjEsMjIsMjIsMjMsMjMsMjQsMjQsMjUsMjUsMjYsMjYsMjcsMjcsMjgsMjgsMjksMjksNjQsNjRdO3QuZXhwb3J0cz1mdW5jdGlvbihlLHQscixuLGkscyxhLG8pe3ZhciBoLHUsbCxmLGMsZCxwLG0sXyxnPW8uYml0cyxiPTAsdj0wLHk9MCx3PTAsaz0wLHg9MCxTPTAsej0wLEM9MCxFPTAsQT1udWxsLEk9MCxPPW5ldyBELkJ1ZjE2KDE2KSxCPW5ldyBELkJ1ZjE2KDE2KSxSPW51bGwsVD0wO2ZvcihiPTA7Yjw9MTU7YisrKU9bYl09MDtmb3Iodj0wO3Y8bjt2KyspT1t0W3Irdl1dKys7Zm9yKGs9Zyx3PTE1OzE8PXcmJjA9PT1PW3ddO3ctLSk7aWYodzxrJiYoaz13KSwwPT09dylyZXR1cm4gaVtzKytdPTIwOTcxNTIwLGlbcysrXT0yMDk3MTUyMCxvLmJpdHM9MSwwO2Zvcih5PTE7eTx3JiYwPT09T1t5XTt5KyspO2ZvcihrPHkmJihrPXkpLGI9ej0xO2I8PTE1O2IrKylpZih6PDw9MSwoei09T1tiXSk8MClyZXR1cm4tMTtpZigwPHomJigwPT09ZXx8MSE9PXcpKXJldHVybi0xO2ZvcihCWzFdPTAsYj0xO2I8MTU7YisrKUJbYisxXT1CW2JdK09bYl07Zm9yKHY9MDt2PG47disrKTAhPT10W3Irdl0mJihhW0JbdFtyK3ZdXSsrXT12KTtpZihkPTA9PT1lPyhBPVI9YSwxOSk6MT09PWU/KEE9RixJLT0yNTcsUj1OLFQtPTI1NywyNTYpOihBPVUsUj1QLC0xKSxiPXksYz1zLFM9dj1FPTAsbD0tMSxmPShDPTE8PCh4PWspKS0xLDE9PT1lJiY4NTI8Q3x8Mj09PWUmJjU5MjxDKXJldHVybiAxO2Zvcig7Oyl7Zm9yKHA9Yi1TLF89YVt2XTxkPyhtPTAsYVt2XSk6YVt2XT5kPyhtPVJbVCthW3ZdXSxBW0krYVt2XV0pOihtPTk2LDApLGg9MTw8Yi1TLHk9dT0xPDx4O2lbYysoRT4+UykrKHUtPWgpXT1wPDwyNHxtPDwxNnxffDAsMCE9PXU7KTtmb3IoaD0xPDxiLTE7RSZoOyloPj49MTtpZigwIT09aD8oRSY9aC0xLEUrPWgpOkU9MCx2KyssMD09LS1PW2JdKXtpZihiPT09dylicmVhaztiPXRbcithW3ZdXX1pZihrPGImJihFJmYpIT09bCl7Zm9yKDA9PT1TJiYoUz1rKSxjKz15LHo9MTw8KHg9Yi1TKTt4K1M8dyYmISgoei09T1t4K1NdKTw9MCk7KXgrKyx6PDw9MTtpZihDKz0xPDx4LDE9PT1lJiY4NTI8Q3x8Mj09PWUmJjU5MjxDKXJldHVybiAxO2lbbD1FJmZdPWs8PDI0fHg8PDE2fGMtc3wwfX1yZXR1cm4gMCE9PUUmJihpW2MrRV09Yi1TPDwyNHw2NDw8MTZ8MCksby5iaXRzPWssMH19LHtcIi4uL3V0aWxzL2NvbW1vblwiOjQxfV0sNTE6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt0LmV4cG9ydHM9ezI6XCJuZWVkIGRpY3Rpb25hcnlcIiwxOlwic3RyZWFtIGVuZFwiLDA6XCJcIixcIi0xXCI6XCJmaWxlIGVycm9yXCIsXCItMlwiOlwic3RyZWFtIGVycm9yXCIsXCItM1wiOlwiZGF0YSBlcnJvclwiLFwiLTRcIjpcImluc3VmZmljaWVudCBtZW1vcnlcIixcIi01XCI6XCJidWZmZXIgZXJyb3JcIixcIi02XCI6XCJpbmNvbXBhdGlibGUgdmVyc2lvblwifX0se31dLDUyOltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIGk9ZShcIi4uL3V0aWxzL2NvbW1vblwiKSxvPTAsaD0xO2Z1bmN0aW9uIG4oZSl7Zm9yKHZhciB0PWUubGVuZ3RoOzA8PS0tdDspZVt0XT0wfXZhciBzPTAsYT0yOSx1PTI1NixsPXUrMSthLGY9MzAsYz0xOSxfPTIqbCsxLGc9MTUsZD0xNixwPTcsbT0yNTYsYj0xNix2PTE3LHk9MTgsdz1bMCwwLDAsMCwwLDAsMCwwLDEsMSwxLDEsMiwyLDIsMiwzLDMsMywzLDQsNCw0LDQsNSw1LDUsNSwwXSxrPVswLDAsMCwwLDEsMSwyLDIsMywzLDQsNCw1LDUsNiw2LDcsNyw4LDgsOSw5LDEwLDEwLDExLDExLDEyLDEyLDEzLDEzXSx4PVswLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDIsMyw3XSxTPVsxNiwxNywxOCwwLDgsNyw5LDYsMTAsNSwxMSw0LDEyLDMsMTMsMiwxNCwxLDE1XSx6PW5ldyBBcnJheSgyKihsKzIpKTtuKHopO3ZhciBDPW5ldyBBcnJheSgyKmYpO24oQyk7dmFyIEU9bmV3IEFycmF5KDUxMik7bihFKTt2YXIgQT1uZXcgQXJyYXkoMjU2KTtuKEEpO3ZhciBJPW5ldyBBcnJheShhKTtuKEkpO3ZhciBPLEIsUixUPW5ldyBBcnJheShmKTtmdW5jdGlvbiBEKGUsdCxyLG4saSl7dGhpcy5zdGF0aWNfdHJlZT1lLHRoaXMuZXh0cmFfYml0cz10LHRoaXMuZXh0cmFfYmFzZT1yLHRoaXMuZWxlbXM9bix0aGlzLm1heF9sZW5ndGg9aSx0aGlzLmhhc19zdHJlZT1lJiZlLmxlbmd0aH1mdW5jdGlvbiBGKGUsdCl7dGhpcy5keW5fdHJlZT1lLHRoaXMubWF4X2NvZGU9MCx0aGlzLnN0YXRfZGVzYz10fWZ1bmN0aW9uIE4oZSl7cmV0dXJuIGU8MjU2P0VbZV06RVsyNTYrKGU+Pj43KV19ZnVuY3Rpb24gVShlLHQpe2UucGVuZGluZ19idWZbZS5wZW5kaW5nKytdPTI1NSZ0LGUucGVuZGluZ19idWZbZS5wZW5kaW5nKytdPXQ+Pj44JjI1NX1mdW5jdGlvbiBQKGUsdCxyKXtlLmJpX3ZhbGlkPmQtcj8oZS5iaV9idWZ8PXQ8PGUuYmlfdmFsaWQmNjU1MzUsVShlLGUuYmlfYnVmKSxlLmJpX2J1Zj10Pj5kLWUuYmlfdmFsaWQsZS5iaV92YWxpZCs9ci1kKTooZS5iaV9idWZ8PXQ8PGUuYmlfdmFsaWQmNjU1MzUsZS5iaV92YWxpZCs9cil9ZnVuY3Rpb24gTChlLHQscil7UChlLHJbMip0XSxyWzIqdCsxXSl9ZnVuY3Rpb24gaihlLHQpe2Zvcih2YXIgcj0wO3J8PTEmZSxlPj4+PTEscjw8PTEsMDwtLXQ7KTtyZXR1cm4gcj4+PjF9ZnVuY3Rpb24gWihlLHQscil7dmFyIG4saSxzPW5ldyBBcnJheShnKzEpLGE9MDtmb3Iobj0xO248PWc7bisrKXNbbl09YT1hK3Jbbi0xXTw8MTtmb3IoaT0wO2k8PXQ7aSsrKXt2YXIgbz1lWzIqaSsxXTswIT09byYmKGVbMippXT1qKHNbb10rKyxvKSl9fWZ1bmN0aW9uIFcoZSl7dmFyIHQ7Zm9yKHQ9MDt0PGw7dCsrKWUuZHluX2x0cmVlWzIqdF09MDtmb3IodD0wO3Q8Zjt0KyspZS5keW5fZHRyZWVbMip0XT0wO2Zvcih0PTA7dDxjO3QrKyllLmJsX3RyZWVbMip0XT0wO2UuZHluX2x0cmVlWzIqbV09MSxlLm9wdF9sZW49ZS5zdGF0aWNfbGVuPTAsZS5sYXN0X2xpdD1lLm1hdGNoZXM9MH1mdW5jdGlvbiBNKGUpezg8ZS5iaV92YWxpZD9VKGUsZS5iaV9idWYpOjA8ZS5iaV92YWxpZCYmKGUucGVuZGluZ19idWZbZS5wZW5kaW5nKytdPWUuYmlfYnVmKSxlLmJpX2J1Zj0wLGUuYmlfdmFsaWQ9MH1mdW5jdGlvbiBIKGUsdCxyLG4pe3ZhciBpPTIqdCxzPTIqcjtyZXR1cm4gZVtpXTxlW3NdfHxlW2ldPT09ZVtzXSYmblt0XTw9bltyXX1mdW5jdGlvbiBHKGUsdCxyKXtmb3IodmFyIG49ZS5oZWFwW3JdLGk9cjw8MTtpPD1lLmhlYXBfbGVuJiYoaTxlLmhlYXBfbGVuJiZIKHQsZS5oZWFwW2krMV0sZS5oZWFwW2ldLGUuZGVwdGgpJiZpKyssIUgodCxuLGUuaGVhcFtpXSxlLmRlcHRoKSk7KWUuaGVhcFtyXT1lLmhlYXBbaV0scj1pLGk8PD0xO2UuaGVhcFtyXT1ufWZ1bmN0aW9uIEsoZSx0LHIpe3ZhciBuLGkscyxhLG89MDtpZigwIT09ZS5sYXN0X2xpdClmb3IoO249ZS5wZW5kaW5nX2J1ZltlLmRfYnVmKzIqb108PDh8ZS5wZW5kaW5nX2J1ZltlLmRfYnVmKzIqbysxXSxpPWUucGVuZGluZ19idWZbZS5sX2J1ZitvXSxvKyssMD09PW4/TChlLGksdCk6KEwoZSwocz1BW2ldKSt1KzEsdCksMCE9PShhPXdbc10pJiZQKGUsaS09SVtzXSxhKSxMKGUscz1OKC0tbiksciksMCE9PShhPWtbc10pJiZQKGUsbi09VFtzXSxhKSksbzxlLmxhc3RfbGl0Oyk7TChlLG0sdCl9ZnVuY3Rpb24gWShlLHQpe3ZhciByLG4saSxzPXQuZHluX3RyZWUsYT10LnN0YXRfZGVzYy5zdGF0aWNfdHJlZSxvPXQuc3RhdF9kZXNjLmhhc19zdHJlZSxoPXQuc3RhdF9kZXNjLmVsZW1zLHU9LTE7Zm9yKGUuaGVhcF9sZW49MCxlLmhlYXBfbWF4PV8scj0wO3I8aDtyKyspMCE9PXNbMipyXT8oZS5oZWFwWysrZS5oZWFwX2xlbl09dT1yLGUuZGVwdGhbcl09MCk6c1syKnIrMV09MDtmb3IoO2UuaGVhcF9sZW48Mjspc1syKihpPWUuaGVhcFsrK2UuaGVhcF9sZW5dPXU8Mj8rK3U6MCldPTEsZS5kZXB0aFtpXT0wLGUub3B0X2xlbi0tLG8mJihlLnN0YXRpY19sZW4tPWFbMippKzFdKTtmb3IodC5tYXhfY29kZT11LHI9ZS5oZWFwX2xlbj4+MTsxPD1yO3ItLSlHKGUscyxyKTtmb3IoaT1oO3I9ZS5oZWFwWzFdLGUuaGVhcFsxXT1lLmhlYXBbZS5oZWFwX2xlbi0tXSxHKGUscywxKSxuPWUuaGVhcFsxXSxlLmhlYXBbLS1lLmhlYXBfbWF4XT1yLGUuaGVhcFstLWUuaGVhcF9tYXhdPW4sc1syKmldPXNbMipyXStzWzIqbl0sZS5kZXB0aFtpXT0oZS5kZXB0aFtyXT49ZS5kZXB0aFtuXT9lLmRlcHRoW3JdOmUuZGVwdGhbbl0pKzEsc1syKnIrMV09c1syKm4rMV09aSxlLmhlYXBbMV09aSsrLEcoZSxzLDEpLDI8PWUuaGVhcF9sZW47KTtlLmhlYXBbLS1lLmhlYXBfbWF4XT1lLmhlYXBbMV0sZnVuY3Rpb24oZSx0KXt2YXIgcixuLGkscyxhLG8saD10LmR5bl90cmVlLHU9dC5tYXhfY29kZSxsPXQuc3RhdF9kZXNjLnN0YXRpY190cmVlLGY9dC5zdGF0X2Rlc2MuaGFzX3N0cmVlLGM9dC5zdGF0X2Rlc2MuZXh0cmFfYml0cyxkPXQuc3RhdF9kZXNjLmV4dHJhX2Jhc2UscD10LnN0YXRfZGVzYy5tYXhfbGVuZ3RoLG09MDtmb3Iocz0wO3M8PWc7cysrKWUuYmxfY291bnRbc109MDtmb3IoaFsyKmUuaGVhcFtlLmhlYXBfbWF4XSsxXT0wLHI9ZS5oZWFwX21heCsxO3I8XztyKyspcDwocz1oWzIqaFsyKihuPWUuaGVhcFtyXSkrMV0rMV0rMSkmJihzPXAsbSsrKSxoWzIqbisxXT1zLHU8bnx8KGUuYmxfY291bnRbc10rKyxhPTAsZDw9biYmKGE9Y1tuLWRdKSxvPWhbMipuXSxlLm9wdF9sZW4rPW8qKHMrYSksZiYmKGUuc3RhdGljX2xlbis9byoobFsyKm4rMV0rYSkpKTtpZigwIT09bSl7ZG97Zm9yKHM9cC0xOzA9PT1lLmJsX2NvdW50W3NdOylzLS07ZS5ibF9jb3VudFtzXS0tLGUuYmxfY291bnRbcysxXSs9MixlLmJsX2NvdW50W3BdLS0sbS09Mn13aGlsZSgwPG0pO2ZvcihzPXA7MCE9PXM7cy0tKWZvcihuPWUuYmxfY291bnRbc107MCE9PW47KXU8KGk9ZS5oZWFwWy0tcl0pfHwoaFsyKmkrMV0hPT1zJiYoZS5vcHRfbGVuKz0ocy1oWzIqaSsxXSkqaFsyKmldLGhbMippKzFdPXMpLG4tLSl9fShlLHQpLFoocyx1LGUuYmxfY291bnQpfWZ1bmN0aW9uIFgoZSx0LHIpe3ZhciBuLGkscz0tMSxhPXRbMV0sbz0wLGg9Nyx1PTQ7Zm9yKDA9PT1hJiYoaD0xMzgsdT0zKSx0WzIqKHIrMSkrMV09NjU1MzUsbj0wO248PXI7bisrKWk9YSxhPXRbMioobisxKSsxXSwrK288aCYmaT09PWF8fChvPHU/ZS5ibF90cmVlWzIqaV0rPW86MCE9PWk/KGkhPT1zJiZlLmJsX3RyZWVbMippXSsrLGUuYmxfdHJlZVsyKmJdKyspOm88PTEwP2UuYmxfdHJlZVsyKnZdKys6ZS5ibF90cmVlWzIqeV0rKyxzPWksdT0obz0wKT09PWE/KGg9MTM4LDMpOmk9PT1hPyhoPTYsMyk6KGg9Nyw0KSl9ZnVuY3Rpb24gVihlLHQscil7dmFyIG4saSxzPS0xLGE9dFsxXSxvPTAsaD03LHU9NDtmb3IoMD09PWEmJihoPTEzOCx1PTMpLG49MDtuPD1yO24rKylpZihpPWEsYT10WzIqKG4rMSkrMV0sISgrK288aCYmaT09PWEpKXtpZihvPHUpZm9yKDtMKGUsaSxlLmJsX3RyZWUpLDAhPS0tbzspO2Vsc2UgMCE9PWk/KGkhPT1zJiYoTChlLGksZS5ibF90cmVlKSxvLS0pLEwoZSxiLGUuYmxfdHJlZSksUChlLG8tMywyKSk6bzw9MTA/KEwoZSx2LGUuYmxfdHJlZSksUChlLG8tMywzKSk6KEwoZSx5LGUuYmxfdHJlZSksUChlLG8tMTEsNykpO3M9aSx1PShvPTApPT09YT8oaD0xMzgsMyk6aT09PWE/KGg9NiwzKTooaD03LDQpfX1uKFQpO3ZhciBxPSExO2Z1bmN0aW9uIEooZSx0LHIsbil7UChlLChzPDwxKSsobj8xOjApLDMpLGZ1bmN0aW9uKGUsdCxyLG4pe00oZSksbiYmKFUoZSxyKSxVKGUsfnIpKSxpLmFycmF5U2V0KGUucGVuZGluZ19idWYsZS53aW5kb3csdCxyLGUucGVuZGluZyksZS5wZW5kaW5nKz1yfShlLHQsciwhMCl9ci5fdHJfaW5pdD1mdW5jdGlvbihlKXtxfHwoZnVuY3Rpb24oKXt2YXIgZSx0LHIsbixpLHM9bmV3IEFycmF5KGcrMSk7Zm9yKG49cj0wO248YS0xO24rKylmb3IoSVtuXT1yLGU9MDtlPDE8PHdbbl07ZSsrKUFbcisrXT1uO2ZvcihBW3ItMV09bixuPWk9MDtuPDE2O24rKylmb3IoVFtuXT1pLGU9MDtlPDE8PGtbbl07ZSsrKUVbaSsrXT1uO2ZvcihpPj49NztuPGY7bisrKWZvcihUW25dPWk8PDcsZT0wO2U8MTw8a1tuXS03O2UrKylFWzI1NitpKytdPW47Zm9yKHQ9MDt0PD1nO3QrKylzW3RdPTA7Zm9yKGU9MDtlPD0xNDM7KXpbMiplKzFdPTgsZSsrLHNbOF0rKztmb3IoO2U8PTI1NTspelsyKmUrMV09OSxlKyssc1s5XSsrO2Zvcig7ZTw9Mjc5Oyl6WzIqZSsxXT03LGUrKyxzWzddKys7Zm9yKDtlPD0yODc7KXpbMiplKzFdPTgsZSsrLHNbOF0rKztmb3IoWih6LGwrMSxzKSxlPTA7ZTxmO2UrKylDWzIqZSsxXT01LENbMiplXT1qKGUsNSk7Tz1uZXcgRCh6LHcsdSsxLGwsZyksQj1uZXcgRChDLGssMCxmLGcpLFI9bmV3IEQobmV3IEFycmF5KDApLHgsMCxjLHApfSgpLHE9ITApLGUubF9kZXNjPW5ldyBGKGUuZHluX2x0cmVlLE8pLGUuZF9kZXNjPW5ldyBGKGUuZHluX2R0cmVlLEIpLGUuYmxfZGVzYz1uZXcgRihlLmJsX3RyZWUsUiksZS5iaV9idWY9MCxlLmJpX3ZhbGlkPTAsVyhlKX0sci5fdHJfc3RvcmVkX2Jsb2NrPUosci5fdHJfZmx1c2hfYmxvY2s9ZnVuY3Rpb24oZSx0LHIsbil7dmFyIGkscyxhPTA7MDxlLmxldmVsPygyPT09ZS5zdHJtLmRhdGFfdHlwZSYmKGUuc3RybS5kYXRhX3R5cGU9ZnVuY3Rpb24oZSl7dmFyIHQscj00MDkzNjI0NDQ3O2Zvcih0PTA7dDw9MzE7dCsrLHI+Pj49MSlpZigxJnImJjAhPT1lLmR5bl9sdHJlZVsyKnRdKXJldHVybiBvO2lmKDAhPT1lLmR5bl9sdHJlZVsxOF18fDAhPT1lLmR5bl9sdHJlZVsyMF18fDAhPT1lLmR5bl9sdHJlZVsyNl0pcmV0dXJuIGg7Zm9yKHQ9MzI7dDx1O3QrKylpZigwIT09ZS5keW5fbHRyZWVbMip0XSlyZXR1cm4gaDtyZXR1cm4gb30oZSkpLFkoZSxlLmxfZGVzYyksWShlLGUuZF9kZXNjKSxhPWZ1bmN0aW9uKGUpe3ZhciB0O2ZvcihYKGUsZS5keW5fbHRyZWUsZS5sX2Rlc2MubWF4X2NvZGUpLFgoZSxlLmR5bl9kdHJlZSxlLmRfZGVzYy5tYXhfY29kZSksWShlLGUuYmxfZGVzYyksdD1jLTE7Mzw9dCYmMD09PWUuYmxfdHJlZVsyKlNbdF0rMV07dC0tKTtyZXR1cm4gZS5vcHRfbGVuKz0zKih0KzEpKzUrNSs0LHR9KGUpLGk9ZS5vcHRfbGVuKzMrNz4+PjMsKHM9ZS5zdGF0aWNfbGVuKzMrNz4+PjMpPD1pJiYoaT1zKSk6aT1zPXIrNSxyKzQ8PWkmJi0xIT09dD9KKGUsdCxyLG4pOjQ9PT1lLnN0cmF0ZWd5fHxzPT09aT8oUChlLDIrKG4/MTowKSwzKSxLKGUseixDKSk6KFAoZSw0KyhuPzE6MCksMyksZnVuY3Rpb24oZSx0LHIsbil7dmFyIGk7Zm9yKFAoZSx0LTI1Nyw1KSxQKGUsci0xLDUpLFAoZSxuLTQsNCksaT0wO2k8bjtpKyspUChlLGUuYmxfdHJlZVsyKlNbaV0rMV0sMyk7VihlLGUuZHluX2x0cmVlLHQtMSksVihlLGUuZHluX2R0cmVlLHItMSl9KGUsZS5sX2Rlc2MubWF4X2NvZGUrMSxlLmRfZGVzYy5tYXhfY29kZSsxLGErMSksSyhlLGUuZHluX2x0cmVlLGUuZHluX2R0cmVlKSksVyhlKSxuJiZNKGUpfSxyLl90cl90YWxseT1mdW5jdGlvbihlLHQscil7cmV0dXJuIGUucGVuZGluZ19idWZbZS5kX2J1ZisyKmUubGFzdF9saXRdPXQ+Pj44JjI1NSxlLnBlbmRpbmdfYnVmW2UuZF9idWYrMiplLmxhc3RfbGl0KzFdPTI1NSZ0LGUucGVuZGluZ19idWZbZS5sX2J1ZitlLmxhc3RfbGl0XT0yNTUmcixlLmxhc3RfbGl0KyssMD09PXQ/ZS5keW5fbHRyZWVbMipyXSsrOihlLm1hdGNoZXMrKyx0LS0sZS5keW5fbHRyZWVbMiooQVtyXSt1KzEpXSsrLGUuZHluX2R0cmVlWzIqTih0KV0rKyksZS5sYXN0X2xpdD09PWUubGl0X2J1ZnNpemUtMX0sci5fdHJfYWxpZ249ZnVuY3Rpb24oZSl7UChlLDIsMyksTChlLG0seiksZnVuY3Rpb24oZSl7MTY9PT1lLmJpX3ZhbGlkPyhVKGUsZS5iaV9idWYpLGUuYmlfYnVmPTAsZS5iaV92YWxpZD0wKTo4PD1lLmJpX3ZhbGlkJiYoZS5wZW5kaW5nX2J1ZltlLnBlbmRpbmcrK109MjU1JmUuYmlfYnVmLGUuYmlfYnVmPj49OCxlLmJpX3ZhbGlkLT04KX0oZSl9fSx7XCIuLi91dGlscy9jb21tb25cIjo0MX1dLDUzOltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dC5leHBvcnRzPWZ1bmN0aW9uKCl7dGhpcy5pbnB1dD1udWxsLHRoaXMubmV4dF9pbj0wLHRoaXMuYXZhaWxfaW49MCx0aGlzLnRvdGFsX2luPTAsdGhpcy5vdXRwdXQ9bnVsbCx0aGlzLm5leHRfb3V0PTAsdGhpcy5hdmFpbF9vdXQ9MCx0aGlzLnRvdGFsX291dD0wLHRoaXMubXNnPVwiXCIsdGhpcy5zdGF0ZT1udWxsLHRoaXMuZGF0YV90eXBlPTIsdGhpcy5hZGxlcj0wfX0se31dLDU0OltmdW5jdGlvbihlLHQscil7KGZ1bmN0aW9uKGUpeyFmdW5jdGlvbihyLG4pe1widXNlIHN0cmljdFwiO2lmKCFyLnNldEltbWVkaWF0ZSl7dmFyIGkscyx0LGEsbz0xLGg9e30sdT0hMSxsPXIuZG9jdW1lbnQsZT1PYmplY3QuZ2V0UHJvdG90eXBlT2YmJk9iamVjdC5nZXRQcm90b3R5cGVPZihyKTtlPWUmJmUuc2V0VGltZW91dD9lOnIsaT1cIltvYmplY3QgcHJvY2Vzc11cIj09PXt9LnRvU3RyaW5nLmNhbGwoci5wcm9jZXNzKT9mdW5jdGlvbihlKXtwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCl7YyhlKX0pfTpmdW5jdGlvbigpe2lmKHIucG9zdE1lc3NhZ2UmJiFyLmltcG9ydFNjcmlwdHMpe3ZhciBlPSEwLHQ9ci5vbm1lc3NhZ2U7cmV0dXJuIHIub25tZXNzYWdlPWZ1bmN0aW9uKCl7ZT0hMX0sci5wb3N0TWVzc2FnZShcIlwiLFwiKlwiKSxyLm9ubWVzc2FnZT10LGV9fSgpPyhhPVwic2V0SW1tZWRpYXRlJFwiK01hdGgucmFuZG9tKCkrXCIkXCIsci5hZGRFdmVudExpc3RlbmVyP3IuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIixkLCExKTpyLmF0dGFjaEV2ZW50KFwib25tZXNzYWdlXCIsZCksZnVuY3Rpb24oZSl7ci5wb3N0TWVzc2FnZShhK2UsXCIqXCIpfSk6ci5NZXNzYWdlQ2hhbm5lbD8oKHQ9bmV3IE1lc3NhZ2VDaGFubmVsKS5wb3J0MS5vbm1lc3NhZ2U9ZnVuY3Rpb24oZSl7YyhlLmRhdGEpfSxmdW5jdGlvbihlKXt0LnBvcnQyLnBvc3RNZXNzYWdlKGUpfSk6bCYmXCJvbnJlYWR5c3RhdGVjaGFuZ2VcImluIGwuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKT8ocz1sLmRvY3VtZW50RWxlbWVudCxmdW5jdGlvbihlKXt2YXIgdD1sLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7dC5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oKXtjKGUpLHQub25yZWFkeXN0YXRlY2hhbmdlPW51bGwscy5yZW1vdmVDaGlsZCh0KSx0PW51bGx9LHMuYXBwZW5kQ2hpbGQodCl9KTpmdW5jdGlvbihlKXtzZXRUaW1lb3V0KGMsMCxlKX0sZS5zZXRJbW1lZGlhdGU9ZnVuY3Rpb24oZSl7XCJmdW5jdGlvblwiIT10eXBlb2YgZSYmKGU9bmV3IEZ1bmN0aW9uKFwiXCIrZSkpO2Zvcih2YXIgdD1uZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aC0xKSxyPTA7cjx0Lmxlbmd0aDtyKyspdFtyXT1hcmd1bWVudHNbcisxXTt2YXIgbj17Y2FsbGJhY2s6ZSxhcmdzOnR9O3JldHVybiBoW29dPW4saShvKSxvKyt9LGUuY2xlYXJJbW1lZGlhdGU9Zn1mdW5jdGlvbiBmKGUpe2RlbGV0ZSBoW2VdfWZ1bmN0aW9uIGMoZSl7aWYodSlzZXRUaW1lb3V0KGMsMCxlKTtlbHNle3ZhciB0PWhbZV07aWYodCl7dT0hMDt0cnl7IWZ1bmN0aW9uKGUpe3ZhciB0PWUuY2FsbGJhY2sscj1lLmFyZ3M7c3dpdGNoKHIubGVuZ3RoKXtjYXNlIDA6dCgpO2JyZWFrO2Nhc2UgMTp0KHJbMF0pO2JyZWFrO2Nhc2UgMjp0KHJbMF0sclsxXSk7YnJlYWs7Y2FzZSAzOnQoclswXSxyWzFdLHJbMl0pO2JyZWFrO2RlZmF1bHQ6dC5hcHBseShuLHIpfX0odCl9ZmluYWxseXtmKGUpLHU9ITF9fX19ZnVuY3Rpb24gZChlKXtlLnNvdXJjZT09PXImJlwic3RyaW5nXCI9PXR5cGVvZiBlLmRhdGEmJjA9PT1lLmRhdGEuaW5kZXhPZihhKSYmYygrZS5kYXRhLnNsaWNlKGEubGVuZ3RoKSl9fShcInVuZGVmaW5lZFwiPT10eXBlb2Ygc2VsZj92b2lkIDA9PT1lP3RoaXM6ZTpzZWxmKX0pLmNhbGwodGhpcyxcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2dsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZj9zZWxmOlwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93Ont9KX0se31dfSx7fSxbMTBdKSgxMCl9KTsiLCIvLyBTZXJ2aWNlIGZvciBOZXRsaWZ5IEFQSSBpbnRlcmFjdGlvbnNcbmltcG9ydCB7IHJlcXVlc3RVcmwsIEFwcCwgTm90aWNlLCBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCBKU1ppcCBmcm9tICdqc3ppcCc7XG5cbi8vIExvZ2dlciB1dGlsaXR5XG5jbGFzcyBMb2dnZXIge1xuICBwcml2YXRlIHN0YXRpYyBsb2dzOiBzdHJpbmdbXSA9IFtdO1xuICBcbiAgc3RhdGljIGxvZyhtZXNzYWdlOiBzdHJpbmcsIGRhdGE/OiBhbnkpIHtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgY29uc3QgbG9nTWVzc2FnZSA9IGBbJHt0aW1lc3RhbXB9XSAke21lc3NhZ2V9YDtcbiAgICBjb25zb2xlLmxvZyhsb2dNZXNzYWdlLCBkYXRhIHx8ICcnKTtcbiAgICB0aGlzLmxvZ3MucHVzaChkYXRhID8gYCR7bG9nTWVzc2FnZX0gJHtKU09OLnN0cmluZ2lmeShkYXRhLCBudWxsLCAyKX1gIDogbG9nTWVzc2FnZSk7XG4gIH1cbiAgXG4gIHN0YXRpYyBlcnJvcihtZXNzYWdlOiBzdHJpbmcsIGVycm9yOiBhbnkpIHtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYFske3RpbWVzdGFtcH1dIEVSUk9SOiAke21lc3NhZ2V9YDtcbiAgICBjb25zb2xlLmVycm9yKGVycm9yTWVzc2FnZSwgZXJyb3IpO1xuICAgIHRoaXMubG9ncy5wdXNoKGAke2Vycm9yTWVzc2FnZX0gJHtlcnJvcj8ubWVzc2FnZSB8fCBlcnJvcn1gKTtcbiAgICBpZiAoZXJyb3I/LnN0YWNrKSB7XG4gICAgICB0aGlzLmxvZ3MucHVzaChgU3RhY2sgdHJhY2U6ICR7ZXJyb3Iuc3RhY2t9YCk7XG4gICAgfVxuICB9XG4gIFxuICBzdGF0aWMgZ2V0TG9ncygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMubG9ncztcbiAgfVxuICBcbiAgc3RhdGljIGNsZWFyKCkge1xuICAgIHRoaXMubG9ncyA9IFtdO1xuICB9XG59XG5cbi8vIEluc3RlYWQgb2YgdXNpbmcgdGhlIE5ldGxpZnkgU0RLLCB3ZSdsbCBpbXBsZW1lbnQgb3VyIG93biBBUEkgY2xpZW50XG4vLyB1c2luZyBPYnNpZGlhbidzIHJlcXVlc3RVcmwgZm9yIGJldHRlciBjb21wYXRpYmlsaXR5XG5jbGFzcyBDdXN0b21OZXRsaWZ5Q2xpZW50IHtcbiAgcHJpdmF0ZSB0b2tlbjogc3RyaW5nO1xuICBcbiAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZykge1xuICAgIHRoaXMudG9rZW4gPSB0b2tlbjtcbiAgICBMb2dnZXIubG9nKCdJbml0aWFsaXppbmcgTmV0bGlmeSBjbGllbnQnKTtcbiAgfVxuICBcbiAgYXN5bmMgZ2V0Q3VycmVudFVzZXIoKSB7XG4gICAgdHJ5IHtcbiAgICAgIExvZ2dlci5sb2coJ0dldHRpbmcgY3VycmVudCB1c2VyJyk7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgICAgICB1cmw6ICdodHRwczovL2FwaS5uZXRsaWZ5LmNvbS9hcGkvdjEvdXNlcicsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQXV0aG9yaXphdGlvbic6IGBCZWFyZXIgJHt0aGlzLnRva2VufWAsXG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgTG9nZ2VyLmxvZygnR290IHVzZXIgcmVzcG9uc2UnLCByZXNwb25zZS5qc29uKTtcbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBMb2dnZXIuZXJyb3IoJ0ZhaWxlZCB0byBnZXQgY3VycmVudCB1c2VyJywgZXJyb3IpO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG4gIFxuICBhc3luYyBjcmVhdGVTaXRlKG9wdGlvbnM6IHsgbmFtZTogc3RyaW5nLCBhY2NvdW50X3NsdWc6IHN0cmluZyB8IG51bGwgfSkge1xuICAgIHRyeSB7XG4gICAgICBMb2dnZXIubG9nKCdDcmVhdGluZyBuZXcgc2l0ZScsIG9wdGlvbnMpO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICAgICAgdXJsOiAnaHR0cHM6Ly9hcGkubmV0bGlmeS5jb20vYXBpL3YxL3NpdGVzJyxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQXV0aG9yaXphdGlvbic6IGBCZWFyZXIgJHt0aGlzLnRva2VufWAsXG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgbmFtZTogb3B0aW9ucy5uYW1lLFxuICAgICAgICAgIGFjY291bnRfc2x1Zzogb3B0aW9ucy5hY2NvdW50X3NsdWdcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBMb2dnZXIubG9nKCdTaXRlIGNyZWF0aW9uIHJlc3BvbnNlJywgcmVzcG9uc2UuanNvbik7XG4gICAgICByZXR1cm4gcmVzcG9uc2UuanNvbjtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgTG9nZ2VyLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIHNpdGUnLCBlcnJvcik7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbiAgXG4gIGFzeW5jIGRlcGxveShzaXRlSWQ6IHN0cmluZywgZmlsZXM6IEFycmF5PHtwYXRoOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZyB8IEFycmF5QnVmZmVyfT4sIG9wdGlvbnM6IHsgdGl0bGU6IHN0cmluZywgZHJhZnQ6IGJvb2xlYW4gfSkge1xuICAgIHRyeSB7XG4gICAgICBMb2dnZXIubG9nKGBTdGFydGluZyBkZXBsb3ltZW50IHRvIHNpdGUgJHtzaXRlSWR9YCwgeyBmaWxlQ291bnQ6IGZpbGVzLmxlbmd0aCwgb3B0aW9ucyB9KTtcbiAgICAgIFxuICAgICAgLy8gQ29udmVydCBmaWxlcyB0byB0aGUgZm9ybWF0IE5ldGxpZnkgZXhwZWN0c1xuICAgICAgY29uc3QgZmlsZU1hcDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICAgICAgXG4gICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBSZWFkIHRoZSBmaWxlIGNvbnRlbnRcbiAgICAgICAgICBsZXQgY29udGVudCA9IGZpbGUuY29udGVudDtcbiAgICAgICAgICBpZiAoY29udGVudCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgICBjb250ZW50ID0gQnVmZmVyLmZyb20oY29udGVudCkudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAvLyBQcmVzZXJ2ZSB0aGUgZnVsbCBwYXRoIHN0cnVjdHVyZSwgYnV0IGVuc3VyZSBpdCdzIHJlbGF0aXZlXG4gICAgICAgICAgLy8gUmVtb3ZlIGFueSBsZWFkaW5nIHNsYXNoZXMgYW5kIG5vcm1hbGl6ZSBwYXRoIHNlcGFyYXRvcnNcbiAgICAgICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBmaWxlLnBhdGgucmVwbGFjZSgvXlxcLysvLCAnJykucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuICAgICAgICAgIExvZ2dlci5sb2coYEFkZGluZyBmaWxlIHRvIGRlcGxveW1lbnQ6ICR7cmVsYXRpdmVQYXRofWApO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIEFkZCB0byBmaWxlIG1hcFxuICAgICAgICAgIGZpbGVNYXBbcmVsYXRpdmVQYXRoXSA9IGNvbnRlbnQ7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgTG9nZ2VyLmVycm9yKGBGYWlsZWQgdG8gcHJvY2VzcyBmaWxlICR7ZmlsZS5wYXRofWAsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAoT2JqZWN0LmtleXMoZmlsZU1hcCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gZmlsZXMgdG8gZGVwbG95Jyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIExvZ2dlci5sb2coJ1ByZXBhcmVkIGZpbGVzIGZvciBkZXBsb3ltZW50JywgeyBwYXRoczogT2JqZWN0LmtleXMoZmlsZU1hcCkgfSk7XG4gICAgICBcbiAgICAgIC8vIENyZWF0ZSBpbml0aWFsIGRlcGxveSB3aXRoIGFzeW5jIGZsYWcgZm9yIGxhcmdlIGRlcGxveXNcbiAgICAgIGNvbnN0IGRlcGxveVJlc3BvbnNlID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgICAgIHVybDogYGh0dHBzOi8vYXBpLm5ldGxpZnkuY29tL2FwaS92MS9zaXRlcy8ke3NpdGVJZH0vZGVwbG95c2AsXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7dGhpcy50b2tlbn1gLFxuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIGZpbGVzOiBmaWxlTWFwLFxuICAgICAgICAgIGRyYWZ0OiBvcHRpb25zLmRyYWZ0LFxuICAgICAgICAgIHRpdGxlOiBvcHRpb25zLnRpdGxlLFxuICAgICAgICAgIGFzeW5jOiB0cnVlIC8vIEVuYWJsZSBhc3luYyBkZXBsb3ltZW50XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgTG9nZ2VyLmxvZygnSW5pdGlhbCBkZXBsb3kgcmVzcG9uc2UnLCBkZXBsb3lSZXNwb25zZS5qc29uKTtcbiAgICAgIFxuICAgICAgLy8gR2V0IHRoZSBkZXBsb3kgSURcbiAgICAgIGNvbnN0IGRlcGxveUlkID0gZGVwbG95UmVzcG9uc2UuanNvbi5pZDtcbiAgICAgIFxuICAgICAgLy8gV2FpdCBmb3IgdGhlIGRlcGxveSB0byBiZSByZWFkeSBmb3IgZmlsZSB1cGxvYWRzXG4gICAgICBsZXQgZGVwbG95U3RhdHVzID0gYXdhaXQgdGhpcy53YWl0Rm9yRGVwbG95KGRlcGxveUlkLCA2MCk7IC8vIEluY3JlYXNlZCBtYXggYXR0ZW1wdHNcbiAgICAgIFxuICAgICAgaWYgKGRlcGxveVN0YXR1cy5zdGF0ZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYERlcGxveSBmYWlsZWQgd2l0aCBzdGF0ZTogJHtkZXBsb3lTdGF0dXMuc3RhdGV9YCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIElmIHdlIGhhdmUgcmVxdWlyZWQgZmlsZXMgdG8gdXBsb2FkLCB1cGxvYWQgdGhlbVxuICAgICAgaWYgKGRlcGxveVN0YXR1cy5yZXF1aXJlZCkge1xuICAgICAgICBMb2dnZXIubG9nKCdVcGxvYWRpbmcgcmVxdWlyZWQgZmlsZXMnLCBkZXBsb3lTdGF0dXMucmVxdWlyZWQpO1xuICAgICAgICBcbiAgICAgICAgZm9yIChjb25zdCBmaWxlUGF0aCBvZiBPYmplY3Qua2V5cyhmaWxlTWFwKSkge1xuICAgICAgICAgIGNvbnN0IGZpbGVDb250ZW50ID0gZmlsZU1hcFtmaWxlUGF0aF07XG4gICAgICAgICAgXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgICAgICAgICAgICB1cmw6IGBodHRwczovL2FwaS5uZXRsaWZ5LmNvbS9hcGkvdjEvZGVwbG95cy8ke2RlcGxveUlkfS9maWxlcy8ke2VuY29kZVVSSUNvbXBvbmVudChmaWxlUGF0aCl9YCxcbiAgICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3RoaXMudG9rZW59YCxcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgYm9keTogZmlsZUNvbnRlbnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBMb2dnZXIubG9nKGBTdWNjZXNzZnVsbHkgdXBsb2FkZWQgZmlsZTogJHtmaWxlUGF0aH1gKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKGBGYWlsZWQgdG8gdXBsb2FkIGZpbGUgJHtmaWxlUGF0aH1gLCBlcnJvcik7XG4gICAgICAgICAgICAvLyBDb250aW51ZSB3aXRoIG90aGVyIGZpbGVzIGV2ZW4gaWYgb25lIGZhaWxzXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFdhaXQgZm9yIHRoZSBmaW5hbCBkZXBsb3kgc3RhdGVcbiAgICAgIGRlcGxveVN0YXR1cyA9IGF3YWl0IHRoaXMud2FpdEZvckRlcGxveShkZXBsb3lJZCwgNjApO1xuICAgICAgXG4gICAgICBpZiAoZGVwbG95U3RhdHVzLnN0YXRlICE9PSAncmVhZHknKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRGVwbG95IGZhaWxlZCB3aXRoIHN0YXRlOiAke2RlcGxveVN0YXR1cy5zdGF0ZX1gKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIGRlcGxveVJlc3BvbnNlLmpzb247XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIExvZ2dlci5lcnJvcignRmFpbGVkIHRvIGRlcGxveSBzaXRlJywgZXJyb3IpO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG4gIFxuICBwcml2YXRlIGFzeW5jIHdhaXRGb3JEZXBsb3koZGVwbG95SWQ6IHN0cmluZywgbWF4QXR0ZW1wdHMgPSA2MCk6IFByb21pc2U8YW55PiB7XG4gICAgTG9nZ2VyLmxvZyhgV2FpdGluZyBmb3IgZGVwbG95ICR7ZGVwbG95SWR9IHRvIGNvbXBsZXRlYCk7XG4gICAgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXhBdHRlbXB0czsgaSsrKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgICAgICAgIHVybDogYGh0dHBzOi8vYXBpLm5ldGxpZnkuY29tL2FwaS92MS9kZXBsb3lzLyR7ZGVwbG95SWR9YCxcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3RoaXMudG9rZW59YFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBkZXBsb3kgPSByZXNwb25zZS5qc29uO1xuICAgICAgICBMb2dnZXIubG9nKGBEZXBsb3kgc3RhdHVzIChhdHRlbXB0ICR7aSArIDF9KWAsIGRlcGxveSk7XG4gICAgICAgIFxuICAgICAgICAvLyBDaGVjayBmb3IgbW9yZSBkZXBsb3ltZW50IHN0YXRlc1xuICAgICAgICBpZiAoZGVwbG95LnN0YXRlID09PSAncmVhZHknIHx8IGRlcGxveS5zdGF0ZSA9PT0gJ2Vycm9yJyB8fCBcbiAgICAgICAgICAgIGRlcGxveS5zdGF0ZSA9PT0gJ3B1Ymxpc2hlZCcgfHwgZGVwbG95LnN0YXRlID09PSAnZmFpbGVkJykge1xuICAgICAgICAgIHJldHVybiBkZXBsb3k7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIElmIHRoZSBkZXBsb3ltZW50IGhhcyBiZWVuIGluICdwcmVwYXJlZCcgc3RhdGUgZm9yIHRvbyBsb25nLCBjb25zaWRlciBpdCByZWFkeVxuICAgICAgICBpZiAoZGVwbG95LnN0YXRlID09PSAncHJlcGFyZWQnICYmIGkgPiAyMCkge1xuICAgICAgICAgIExvZ2dlci5sb2coJ0RlcGxveW1lbnQgaGFzIGJlZW4gaW4gcHJlcGFyZWQgc3RhdGUgZm9yIGEgbG9uZyB0aW1lLCBjb25zaWRlcmluZyBpdCByZWFkeScpO1xuICAgICAgICAgIHJldHVybiBkZXBsb3k7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIElmIHRoZSBkZXBsb3ltZW50IGhhcyBiZWVuIGluICd1cGxvYWRpbmcnIHN0YXRlIGZvciB0b28gbG9uZywgY29uc2lkZXIgaXQgcmVhZHlcbiAgICAgICAgaWYgKGRlcGxveS5zdGF0ZSA9PT0gJ3VwbG9hZGluZycgJiYgaSA+IDMwKSB7XG4gICAgICAgICAgTG9nZ2VyLmxvZygnRGVwbG95bWVudCBoYXMgYmVlbiBpbiB1cGxvYWRpbmcgc3RhdGUgZm9yIGEgbG9uZyB0aW1lLCBjb25zaWRlcmluZyBpdCByZWFkeScpO1xuICAgICAgICAgIHJldHVybiBkZXBsb3k7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIFdhaXQgMiBzZWNvbmRzIGJlZm9yZSBuZXh0IGF0dGVtcHRcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDIwMDApKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIExvZ2dlci5lcnJvcihgRmFpbGVkIHRvIGNoZWNrIGRlcGxveSBzdGF0dXMgKGF0dGVtcHQgJHtpICsgMX0pYCwgZXJyb3IpO1xuICAgICAgICAvLyBDb250aW51ZSB0byBuZXh0IGF0dGVtcHRcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgdGhyb3cgbmV3IEVycm9yKCdEZXBsb3kgdGltZWQgb3V0Jyk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBOZXRsaWZ5RGVwbG95bWVudFJlc3BvbnNlIHtcbiAgaWQ6IHN0cmluZztcbiAgdXJsOiBzdHJpbmc7XG4gIHNpdGVfaWQ6IHN0cmluZztcbiAgZGVwbG95X2lkOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgc3RhdGU6IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmV0bGlmeVNlcnZpY2Uge1xuICBwcml2YXRlIHRva2VuOiBzdHJpbmc7XG4gIHByaXZhdGUgc2l0ZUlkOiBzdHJpbmc7XG4gIHByaXZhdGUgc2l0ZU5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSB1c2VDdXN0b21Eb21haW46IGJvb2xlYW47XG4gIHByaXZhdGUgY3VzdG9tRG9tYWluOiBzdHJpbmc7XG4gIHByaXZhdGUgbmV0bGlmeUNsaWVudDogQ3VzdG9tTmV0bGlmeUNsaWVudCB8IG51bGw7XG4gIHByaXZhdGUgYXBwOiBBcHA7XG4gIHByaXZhdGUgc2F2ZVNldHRpbmdzOiAoc2V0dGluZ3M6IGFueSkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBhbnksIGFwcDogQXBwLCBzYXZlU2V0dGluZ3M6IChzZXR0aW5nczogYW55KSA9PiBQcm9taXNlPHZvaWQ+KSB7XG4gICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgdGhpcy50b2tlbiA9IHNldHRpbmdzLm5ldGxpZnlUb2tlbiB8fCAnJztcbiAgICB0aGlzLnNpdGVJZCA9IHNldHRpbmdzLnNpdGVJZCB8fCAnJztcbiAgICB0aGlzLnNpdGVOYW1lID0gc2V0dGluZ3Muc2l0ZU5hbWUgfHwgJyc7XG4gICAgdGhpcy51c2VDdXN0b21Eb21haW4gPSBzZXR0aW5ncy51c2VDdXN0b21Eb21haW4gfHwgZmFsc2U7XG4gICAgdGhpcy5jdXN0b21Eb21haW4gPSBzZXR0aW5ncy5jdXN0b21Eb21haW4gfHwgJyc7XG4gICAgdGhpcy5uZXRsaWZ5Q2xpZW50ID0gbnVsbDtcbiAgICB0aGlzLnNhdmVTZXR0aW5ncyA9IHNhdmVTZXR0aW5ncztcbiAgICBcbiAgICAvLyBJbml0aWFsaXplIE5ldGxpZnkgY2xpZW50IGlmIHdlIGhhdmUgYSB0b2tlblxuICAgIGlmICh0aGlzLnRva2VuKSB7XG4gICAgICB0aGlzLmluaXROZXRsaWZ5Q2xpZW50KCk7XG4gICAgfVxuICB9XG4gIFxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgTmV0bGlmeSBjbGllbnRcbiAgICovXG4gIHByaXZhdGUgaW5pdE5ldGxpZnlDbGllbnQoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMubmV0bGlmeUNsaWVudCA9IG5ldyBDdXN0b21OZXRsaWZ5Q2xpZW50KHRoaXMudG9rZW4pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gaW5pdGlhbGl6ZSBOZXRsaWZ5IGNsaWVudDonLCBlcnJvcik7XG4gICAgICB0aGlzLm5ldGxpZnlDbGllbnQgPSBudWxsO1xuICAgICAgbmV3IE5vdGljZSgnRmFpbGVkIHRvIGluaXRpYWxpemUgTmV0bGlmeSBjbGllbnQuIFBsZWFzZSBjaGVjayB5b3VyIHRva2VuLicpO1xuICAgIH1cbiAgfVxuICBcbiAgLyoqXG4gICAqIFZhbGlkYXRlIHRoZSBOZXRsaWZ5IEFQSSB0b2tlblxuICAgKi9cbiAgYXN5bmMgdmFsaWRhdGVUb2tlbih0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIFVzZSBvdXIgY3VzdG9tIE5ldGxpZnkgQVBJIGNsaWVudFxuICAgICAgY29uc3QgdGVtcENsaWVudCA9IG5ldyBDdXN0b21OZXRsaWZ5Q2xpZW50KHRva2VuKTtcbiAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCB0ZW1wQ2xpZW50LmdldEN1cnJlbnRVc2VyKCk7XG4gICAgICByZXR1cm4gISF1c2VyLmlkO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gdmFsaWRhdGUgTmV0bGlmeSB0b2tlbjonLCBlcnJvcik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIFxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IE5ldGxpZnkgc2l0ZSBpZiBvbmUgZG9lc24ndCBleGlzdCB5ZXRcbiAgICovXG4gIHByaXZhdGUgYXN5bmMgY3JlYXRlU2l0ZUlmTmVlZGVkKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIElmIHdlIGhhdmUgYSBzaXRlIElELCB2ZXJpZnkgaXQgZXhpc3RzXG4gICAgICBpZiAodGhpcy5zaXRlSWQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgICAgICAgICAgdXJsOiBgaHR0cHM6Ly9hcGkubmV0bGlmeS5jb20vYXBpL3YxL3NpdGVzLyR7dGhpcy5zaXRlSWR9YCxcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3RoaXMudG9rZW59YFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiB0aGlzLnNpdGVJZDtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBMb2dnZXIubG9nKCdTaXRlIElEIG5vdCBmb3VuZCwgY3JlYXRpbmcgbmV3IHNpdGUnKTtcbiAgICAgICAgICAvLyBJZiBzaXRlIG5vdCBmb3VuZCwgY29udGludWUgdG8gY3JlYXRlIG5ldyBzaXRlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gRW5zdXJlIHdlIGhhdmUgYSBjbGllbnRcbiAgICAgIGlmICghdGhpcy5uZXRsaWZ5Q2xpZW50KSB7XG4gICAgICAgIHRoaXMuaW5pdE5ldGxpZnlDbGllbnQoKTtcbiAgICAgICAgXG4gICAgICAgIGlmICghdGhpcy5uZXRsaWZ5Q2xpZW50KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gaW5pdGlhbGl6ZSBOZXRsaWZ5IGNsaWVudCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIENyZWF0ZSBhIG5ldyBzaXRlIHdpdGggYSBzYW5pdGl6ZWQgbmFtZVxuICAgICAgbGV0IHNpdGVOYW1lID0gdGhpcy5zaXRlTmFtZSB8fCBgb2JzaWRpYW4tc2xpZGVzLSR7RGF0ZS5ub3coKX1gO1xuICAgICAgLy8gUmVwbGFjZSBhbnkgY2hhcmFjdGVycyB0aGF0IG1pZ2h0IGNhdXNlIGlzc3Vlc1xuICAgICAgc2l0ZU5hbWUgPSBzaXRlTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvW15hLXowLTldL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnN0cmluZygwLCA2Myk7IC8vIE5ldGxpZnkgaGFzIGEgbWF4IGxlbmd0aCBsaW1pdFxuICAgICAgXG4gICAgICBMb2dnZXIubG9nKCdDcmVhdGluZyBuZXcgc2l0ZSB3aXRoIHNhbml0aXplZCBuYW1lOicsIHNpdGVOYW1lKTtcbiAgICAgIFxuICAgICAgY29uc3Qgc2l0ZSA9IGF3YWl0IHRoaXMubmV0bGlmeUNsaWVudC5jcmVhdGVTaXRlKHtcbiAgICAgICAgbmFtZTogc2l0ZU5hbWUsXG4gICAgICAgIGFjY291bnRfc2x1ZzogbnVsbCAvLyBVc2UgdGhlIHVzZXIncyBkZWZhdWx0IGFjY291bnRcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBMb2dnZXIubG9nKCdDcmVhdGVkIG5ldyBzaXRlOicsIHNpdGUpO1xuICAgICAgXG4gICAgICAvLyBTYXZlIHRoZSBzaXRlIElEIGFuZCB1cGRhdGUgdGhlIHNpdGUgbmFtZSBpZiBpdCB3YXMgYXV0by1nZW5lcmF0ZWRcbiAgICAgIHRoaXMuc2l0ZUlkID0gc2l0ZS5pZDtcbiAgICAgIGlmICghdGhpcy5zaXRlTmFtZSkge1xuICAgICAgICB0aGlzLnNpdGVOYW1lID0gc2l0ZU5hbWU7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFNhdmUgc2V0dGluZ3NcbiAgICAgIGF3YWl0IHRoaXMuc2F2ZVNldHRpbmdzKHtcbiAgICAgICAgbmV0bGlmeVRva2VuOiB0aGlzLnRva2VuLFxuICAgICAgICBzaXRlSWQ6IHNpdGUuaWQsXG4gICAgICAgIHNpdGVOYW1lOiB0aGlzLnNpdGVOYW1lLFxuICAgICAgICB1c2VDdXN0b21Eb21haW46IHRoaXMudXNlQ3VzdG9tRG9tYWluLFxuICAgICAgICBjdXN0b21Eb21haW46IHRoaXMuY3VzdG9tRG9tYWluXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgcmV0dXJuIHRoaXMuc2l0ZUlkO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBMb2dnZXIuZXJyb3IoJ0ZhaWxlZCB0byBjcmVhdGUgTmV0bGlmeSBzaXRlJywgZXJyb3IpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIE5ldGxpZnkgc2l0ZS4gUGxlYXNlIGNoZWNrIHlvdXIgdG9rZW4gYW5kIHRyeSBhZ2Fpbi4nKTtcbiAgICB9XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBEZXBsb3kgc2xpZGVzIHRvIE5ldGxpZnlcbiAgICovXG4gIGFzeW5jIGRlcGxveVRvTmV0bGlmeShleHBvcnRQYXRoOiBzdHJpbmcsIGRlcGxveW1lbnROYW1lOiBzdHJpbmcpOiBQcm9taXNlPE5ldGxpZnlEZXBsb3ltZW50UmVzcG9uc2U+IHtcbiAgICB0cnkge1xuICAgICAgTG9nZ2VyLmxvZygnU3RhcnRpbmcgZGVwbG95bWVudCBwcm9jZXNzLi4uJyk7XG4gICAgICBMb2dnZXIubG9nKCdFeHBvcnQgcGF0aDonLCBleHBvcnRQYXRoKTtcbiAgICAgIExvZ2dlci5sb2coJ0RlcGxveW1lbnQgbmFtZTonLCBkZXBsb3ltZW50TmFtZSk7XG4gICAgICBcbiAgICAgIC8vIEVuc3VyZSB3ZSBoYXZlIGEgc2l0ZVxuICAgICAgY29uc3Qgc2l0ZUlkID0gYXdhaXQgdGhpcy5jcmVhdGVTaXRlSWZOZWVkZWQoKTtcbiAgICAgIExvZ2dlci5sb2coJ1VzaW5nIHNpdGUgSUQ6Jywgc2l0ZUlkKTtcbiAgICAgIFxuICAgICAgLy8gMS4gR2V0IGFsbCBmaWxlcyBmcm9tIHRoZSBleHBvcnQgcGF0aFxuICAgICAgY29uc3QgZmlsZXMgPSBhd2FpdCB0aGlzLmdldEZpbGVzRnJvbUV4cG9ydFBhdGgoZXhwb3J0UGF0aCk7XG4gICAgICBMb2dnZXIubG9nKCdGb3VuZCBmaWxlcyB0byBkZXBsb3k6JywgZmlsZXMpO1xuICAgICAgXG4gICAgICBpZiAoZmlsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gZmlsZXMgZm91bmQgdG8gZGVwbG95LiBQbGVhc2UgZW5zdXJlIHRoZSBzbGlkZXMgd2VyZSBleHBvcnRlZCBjb3JyZWN0bHkuJyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIDIuIFJlYWQgYWxsIGZpbGUgY29udGVudHNcbiAgICAgIGNvbnN0IGZpbGVDb250ZW50cyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICBmaWxlcy5tYXAoYXN5bmMgKGZpbGUpID0+IHtcbiAgICAgICAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgdGhpcy5yZWFkRmlsZShmaWxlLnBhdGgpO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwYXRoOiBmaWxlLm5hbWUsIC8vIFVzZSB0aGUgcmVsYXRpdmUgcGF0aCBuYW1lXG4gICAgICAgICAgICBjb250ZW50XG4gICAgICAgICAgfTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgICBcbiAgICAgIC8vIEVuc3VyZSB3ZSBoYXZlIGEgY2xpZW50XG4gICAgICBpZiAoIXRoaXMubmV0bGlmeUNsaWVudCkge1xuICAgICAgICB0aGlzLmluaXROZXRsaWZ5Q2xpZW50KCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIXRoaXMubmV0bGlmeUNsaWVudCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGluaXRpYWxpemUgTmV0bGlmeSBjbGllbnQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICAvLyAzLiBEZXBsb3kgdG8gTmV0bGlmeSB1c2luZyBvdXIgY3VzdG9tIGNsaWVudFxuICAgICAgTG9nZ2VyLmxvZygnU3RhcnRpbmcgTmV0bGlmeSBkZXBsb3ltZW50Li4uJyk7XG4gICAgICBjb25zdCBkZXBsb3ltZW50ID0gYXdhaXQgdGhpcy5uZXRsaWZ5Q2xpZW50LmRlcGxveShzaXRlSWQsIGZpbGVDb250ZW50cywge1xuICAgICAgICB0aXRsZTogZGVwbG95bWVudE5hbWUgfHwgdGhpcy5zaXRlTmFtZSxcbiAgICAgICAgZHJhZnQ6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgLy8gNC4gUmV0dXJuIGRlcGxveW1lbnQgaW5mb1xuICAgICAgY29uc3QgZGVwbG95bWVudEluZm8gPSB7XG4gICAgICAgIGlkOiBkZXBsb3ltZW50LmlkLFxuICAgICAgICB1cmw6IGRlcGxveW1lbnQuZGVwbG95X3NzbF91cmwgfHwgZGVwbG95bWVudC5kZXBsb3lfdXJsLFxuICAgICAgICBzaXRlX2lkOiBkZXBsb3ltZW50LnNpdGVfaWQsXG4gICAgICAgIGRlcGxveV9pZDogZGVwbG95bWVudC5pZCxcbiAgICAgICAgbmFtZTogZGVwbG95bWVudE5hbWUsXG4gICAgICAgIHN0YXRlOiBkZXBsb3ltZW50LnN0YXRlXG4gICAgICB9O1xuICAgICAgXG4gICAgICBMb2dnZXIubG9nKCdEZXBsb3ltZW50IGNvbXBsZXRlZDonLCBkZXBsb3ltZW50SW5mbyk7XG4gICAgICByZXR1cm4gZGVwbG95bWVudEluZm87XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIExvZ2dlci5lcnJvcignRGVwbG95bWVudCBmYWlsZWQ6JywgZXJyb3IpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBEZXBsb3ltZW50IGZhaWxlZDogJHtlcnJvci5tZXNzYWdlfWApO1xuICAgIH1cbiAgfVxuICBcbiAgLyoqXG4gICAqIEdldCBmaWxlcyBmcm9tIGV4cG9ydCBwYXRoIC0gcmVjdXJzaXZlbHkgZ2V0cyBhbGwgZmlsZXNcbiAgICovXG4gIHByaXZhdGUgYXN5bmMgZ2V0RmlsZXNGcm9tRXhwb3J0UGF0aChleHBvcnRQYXRoOiBzdHJpbmcpOiBQcm9taXNlPEFycmF5PHtwYXRoOiBzdHJpbmcsIG5hbWU6IHN0cmluZ30+PiB7XG4gICAgdHJ5IHtcbiAgICAgIExvZ2dlci5sb2coJ0xvb2tpbmcgZm9yIGZpbGVzIGluIGV4cG9ydCBwYXRoOicsIGV4cG9ydFBhdGgpO1xuICAgICAgXG4gICAgICAvLyBGaXJzdCBjaGVjayBpZiB0aGUgZGlyZWN0b3J5IGV4aXN0c1xuICAgICAgLy8gQHRzLWlnbm9yZSAtIGV4aXN0cyBpcyBub3QgaW4gdGhlIHB1YmxpYyBBUEkgdHlwaW5nc1xuICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgdGhpcy5hcHAudmF1bHQuYWRhcHRlci5leGlzdHMoZXhwb3J0UGF0aCk7XG4gICAgICBpZiAoIWV4aXN0cykge1xuICAgICAgICBMb2dnZXIuZXJyb3IoJ0V4cG9ydCBkaXJlY3RvcnkgZG9lcyBub3QgZXhpc3QnLCBleHBvcnRQYXRoKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBvcnQgZGlyZWN0b3J5IGRvZXMgbm90IGV4aXN0Jyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFRyeSB0byByZWFkIHRoZSBtYW5pZmVzdCBmaWxlIGZpcnN0XG4gICAgICB0cnkge1xuICAgICAgICAvLyBAdHMtaWdub3JlIC0gcmVhZCBpcyBub3QgaW4gdGhlIHB1YmxpYyBBUEkgdHlwaW5nc1xuICAgICAgICBjb25zdCBtYW5pZmVzdENvbnRlbnQgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5hZGFwdGVyLnJlYWQoYCR7ZXhwb3J0UGF0aH0vbWFuaWZlc3QuanNvbmApO1xuICAgICAgICBjb25zdCBtYW5pZmVzdCA9IEpTT04ucGFyc2UobWFuaWZlc3RDb250ZW50KTtcbiAgICAgICAgTG9nZ2VyLmxvZygnRm91bmQgbWFuaWZlc3QgZmlsZTonLCBtYW5pZmVzdCk7XG4gICAgICAgIFxuICAgICAgICAvLyBVc2UgdGhlIGZpbGVzIGxpc3RlZCBpbiB0aGUgbWFuaWZlc3RcbiAgICAgICAgcmV0dXJuIG1hbmlmZXN0LmZpbGVzLm1hcCgoZmlsZU5hbWU6IHN0cmluZykgPT4gKHtcbiAgICAgICAgICBwYXRoOiBgJHtleHBvcnRQYXRofS8ke2ZpbGVOYW1lfWAsXG4gICAgICAgICAgbmFtZTogZmlsZU5hbWVcbiAgICAgICAgfSkpO1xuICAgICAgfSBjYXRjaCAobWFuaWZlc3RFcnJvcikge1xuICAgICAgICBMb2dnZXIubG9nKCdObyBtYW5pZmVzdCBmaWxlIGZvdW5kLCBzY2FubmluZyBkaXJlY3RvcnknKTtcbiAgICAgICAgXG4gICAgICAgIC8vIElmIG5vIG1hbmlmZXN0LCB0cnkgdG8gbGlzdCBmaWxlcyBkaXJlY3RseVxuICAgICAgICAvLyBAdHMtaWdub3JlIC0gbGlzdCBpcyBub3QgaW4gdGhlIHB1YmxpYyBBUEkgdHlwaW5nc1xuICAgICAgICBjb25zdCBsaXN0aW5nID0gYXdhaXQgdGhpcy5hcHAudmF1bHQuYWRhcHRlci5saXN0KGV4cG9ydFBhdGgpO1xuICAgICAgICBMb2dnZXIubG9nKCdEaXJlY3RvcnkgbGlzdGluZzonLCBsaXN0aW5nKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHJlc3VsdHM6IEFycmF5PHtwYXRoOiBzdHJpbmcsIG5hbWU6IHN0cmluZ30+ID0gW107XG4gICAgICAgIFxuICAgICAgICAvLyBQcm9jZXNzIGZpbGVzXG4gICAgICAgIGZvciAoY29uc3QgZmlsZVBhdGggb2YgbGlzdGluZy5maWxlcykge1xuICAgICAgICAgIC8vIEdldCB0aGUgcmVsYXRpdmUgcGF0aCBieSByZW1vdmluZyB0aGUgZXhwb3J0IHBhdGggcHJlZml4XG4gICAgICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gZmlsZVBhdGguc3RhcnRzV2l0aChleHBvcnRQYXRoKSBcbiAgICAgICAgICAgID8gZmlsZVBhdGguc3Vic3RyaW5nKGV4cG9ydFBhdGgubGVuZ3RoKS5yZXBsYWNlKC9eXFwvKy8sICcnKSBcbiAgICAgICAgICAgIDogZmlsZVBhdGg7XG4gICAgICAgICAgXG4gICAgICAgICAgY29uc3QgbmFtZSA9IGZpbGVQYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHsgcGF0aDogZmlsZVBhdGgsIG5hbWU6IHJlbGF0aXZlUGF0aCB9KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIExvZ2dlci5lcnJvcignRXJyb3IgcmVhZGluZyBmaWxlcyBmcm9tIGV4cG9ydCBwYXRoJywgZXJyb3IpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gcmVhZCBleHBvcnRlZCBmaWxlczogJHtlcnJvci5tZXNzYWdlfWApO1xuICAgIH1cbiAgfVxuICBcbiAgLyoqXG4gICAqIFJlYWQgZmlsZSBjb250ZW50IHVzaW5nIE9ic2lkaWFuJ3MgYWRhcHRlclxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyByZWFkRmlsZShwYXRoOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHRyeSB7XG4gICAgICAvLyBAdHMtaWdub3JlIC0gcmVhZCBpcyBub3QgaW4gdGhlIHB1YmxpYyBBUEkgdHlwaW5nc1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIucmVhZChwYXRoKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgTG9nZ2VyLmVycm9yKGBFcnJvciByZWFkaW5nIGZpbGUgJHtwYXRofWAsIGVycm9yKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIHJlYWQgZmlsZSAke3BhdGh9OiAke2Vycm9yLm1lc3NhZ2V9YCk7XG4gICAgfVxuICB9XG4gIFxuICAvKipcbiAgICogR2V0IGRlcGxveW1lbnQgbG9nc1xuICAgKi9cbiAgZ2V0RGVwbG95bWVudExvZ3MoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBMb2dnZXIuZ2V0TG9ncygpO1xuICB9XG4gIFxuICAvKipcbiAgICogQ2xlYXIgZGVwbG95bWVudCBsb2dzXG4gICAqL1xuICBjbGVhckRlcGxveW1lbnRMb2dzKCkge1xuICAgIExvZ2dlci5jbGVhcigpO1xuICB9XG59XG5cbiIsIjxzY3JpcHQgbGFuZz1cInRzXCI+XG4gIGltcG9ydCB7IG9uTW91bnQgfSBmcm9tICdzdmVsdGUnO1xuICBpbXBvcnQgQXV0aEZsb3cgZnJvbSAnLi9BdXRoRmxvdy5zdmVsdGUnO1xuICBpbXBvcnQgTmV0bGlmeVNlcnZpY2UgZnJvbSAnLi4vc2VydmljZXMvbmV0bGlmeS1zZXJ2aWNlJztcbiAgXG4gIGV4cG9ydCBsZXQgc2V0dGluZ3M6IGFueTtcbiAgZXhwb3J0IGxldCBzYXZlU2V0dGluZ3M6ICgpID0+IFByb21pc2U8dm9pZD47XG4gIGV4cG9ydCBsZXQgbmV0bGlmeVNlcnZpY2U6IE5ldGxpZnlTZXJ2aWNlO1xuXG4gIGxldCBpc1ZhbGlkYXRpbmdUb2tlbiA9IGZhbHNlO1xuICBsZXQgdG9rZW5WYWxpZGF0ZWQgPSBmYWxzZTtcbiAgbGV0IHZhbGlkYXRpb25NZXNzYWdlID0gJyc7XG4gIGxldCBzaG93U2V0dXBXaXphcmQgPSAhc2V0dGluZ3MuaGFzQ29tcGxldGVkU2V0dXA7XG4gIGxldCBkZXBsb3ltZW50SGlzdG9yeSA9IHNldHRpbmdzLmRlcGxveW1lbnRIaXN0b3J5IHx8IFtdO1xuICBsZXQgdGhlbWVzID0gW1xuICAgIHsgaWQ6ICdkZWZhdWx0JywgbmFtZTogJ0RlZmF1bHQnIH0sXG4gICAgeyBpZDogJ2RhcmsnLCBuYW1lOiAnRGFyaycgfSxcbiAgICB7IGlkOiAnbGlnaHQnLCBuYW1lOiAnTGlnaHQnIH0sXG4gICAgeyBpZDogJ21pbmltYWwnLCBuYW1lOiAnTWluaW1hbCcgfVxuICBdO1xuICBcbiAgLy8gU2l0ZSBuYW1lIGdlbmVyYXRvciBvcHRpb25zXG4gIGxldCBnZW5lcmF0ZWROYW1lczogc3RyaW5nW10gPSBbXTtcbiAgbGV0IGlzR2VuZXJhdGluZ05hbWVzID0gZmFsc2U7XG4gIFxuICAvLyBHZW5lcmF0ZSByYW5kb20gc2l0ZSBuYW1lc1xuICBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZVNpdGVOYW1lcygpIHtcbiAgICBpc0dlbmVyYXRpbmdOYW1lcyA9IHRydWU7XG4gICAgY29uc3QgYWRqZWN0aXZlcyA9IFsnYW1hemluZycsICdicmlsbGlhbnQnLCAnY2xldmVyJywgJ2RlbGlnaHRmdWwnLCAnZWxlZ2FudCcsICdmYW5jeScsICdnb3JnZW91cyddO1xuICAgIGNvbnN0IG5vdW5zID0gWydzbGlkZXMnLCAncHJlc2VudGF0aW9uJywgJ2RlY2snLCAnc2hvd2Nhc2UnLCAndGFsaycsICdicmllZmluZycsICdwaXRjaCddO1xuICAgIFxuICAgIGdlbmVyYXRlZE5hbWVzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgIGNvbnN0IGFkamVjdGl2ZSA9IGFkamVjdGl2ZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYWRqZWN0aXZlcy5sZW5ndGgpXTtcbiAgICAgIGNvbnN0IG5vdW4gPSBub3Vuc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBub3Vucy5sZW5ndGgpXTtcbiAgICAgIGNvbnN0IHJhbmRvbU51bSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDApO1xuICAgICAgZ2VuZXJhdGVkTmFtZXMucHVzaChgJHthZGplY3RpdmV9LSR7bm91bn0tJHtyYW5kb21OdW19YCk7XG4gICAgfVxuICAgIFxuICAgIGlzR2VuZXJhdGluZ05hbWVzID0gZmFsc2U7XG4gIH1cbiAgXG4gIC8vIFNlbGVjdCBhIGdlbmVyYXRlZCBuYW1lXG4gIGZ1bmN0aW9uIHNlbGVjdFNpdGVOYW1lKG5hbWU6IHN0cmluZykge1xuICAgIHNldHRpbmdzLnNpdGVOYW1lID0gbmFtZTtcbiAgICBzYXZlU2V0dGluZ3MoKTtcbiAgfVxuICBcbiAgLy8gVmFsaWRhdGUgTmV0bGlmeSB0b2tlblxuICBhc3luYyBmdW5jdGlvbiB2YWxpZGF0ZVRva2VuKCkge1xuICAgIGlmICghc2V0dGluZ3MubmV0bGlmeVRva2VuKSB7XG4gICAgICB2YWxpZGF0aW9uTWVzc2FnZSA9ICdQbGVhc2UgZW50ZXIgYSBOZXRsaWZ5IHRva2VuIGZpcnN0JztcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaXNWYWxpZGF0aW5nVG9rZW4gPSB0cnVlO1xuICAgIHZhbGlkYXRpb25NZXNzYWdlID0gJyc7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGlzVmFsaWQgPSBhd2FpdCBuZXRsaWZ5U2VydmljZS52YWxpZGF0ZVRva2VuKHNldHRpbmdzLm5ldGxpZnlUb2tlbik7XG4gICAgICB0b2tlblZhbGlkYXRlZCA9IGlzVmFsaWQ7XG4gICAgICB2YWxpZGF0aW9uTWVzc2FnZSA9IGlzVmFsaWQgPyAnVG9rZW4gaXMgdmFsaWQhJyA6ICdJbnZhbGlkIHRva2VuLiBQbGVhc2UgY2hlY2sgYW5kIHRyeSBhZ2Fpbi4nO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB2YWxpZGF0aW9uTWVzc2FnZSA9IGBFcnJvciB2YWxpZGF0aW5nIHRva2VuOiAke2Vycm9yLm1lc3NhZ2V9YDtcbiAgICAgIHRva2VuVmFsaWRhdGVkID0gZmFsc2U7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlzVmFsaWRhdGluZ1Rva2VuID0gZmFsc2U7XG4gICAgfVxuICAgIFxuICAgIC8vIElmIHZhbGlkYXRlZCwgc2F2ZSBzZXR0aW5nc1xuICAgIGlmICh0b2tlblZhbGlkYXRlZCkge1xuICAgICAgYXdhaXQgc2F2ZVNldHRpbmdzKCk7XG4gICAgfVxuICB9XG4gIFxuICAvLyBDb21wbGV0ZSBzZXR1cCBwcm9jZXNzXG4gIGZ1bmN0aW9uIGNvbXBsZXRlU2V0dXAoKSB7XG4gICAgc2V0dGluZ3MuaGFzQ29tcGxldGVkU2V0dXAgPSB0cnVlO1xuICAgIHNhdmVTZXR0aW5ncygpO1xuICAgIHNob3dTZXR1cFdpemFyZCA9IGZhbHNlO1xuICB9XG4gIFxuICAvLyBXYXRjaCBmb3Igc2V0dGluZ3MgY2hhbmdlc1xuICBmdW5jdGlvbiBoYW5kbGVTZXR0aW5nc0NoYW5nZSgpIHtcbiAgICBzYXZlU2V0dGluZ3MoKTtcbiAgfVxuICBcbiAgb25Nb3VudCgoKSA9PiB7XG4gICAgLy8gR2VuZXJhdGUgc2l0ZSBuYW1lcyBvbiBjb21wb25lbnQgbW91bnRcbiAgICBpZiAoIXNldHRpbmdzLnNpdGVOYW1lKSB7XG4gICAgICBnZW5lcmF0ZVNpdGVOYW1lcygpO1xuICAgIH1cbiAgfSk7XG48L3NjcmlwdD5cblxuPGRpdiBjbGFzcz1cImFkdmFuY2VkLXNsaWRlcy1uZXRsaWZ5LXNldHRpbmdzXCI+XG4gIHsjaWYgc2hvd1NldHVwV2l6YXJkfVxuICAgIDxkaXYgY2xhc3M9XCJzZXR1cC13aXphcmRcIj5cbiAgICAgIDxoMj5TZXR1cCBXaXphcmQ8L2gyPlxuICAgICAgPHA+TGV0J3Mgc2V0IHVwIHlvdXIgTmV0bGlmeSBkZXBsb3ltZW50IGluIGEgZmV3IHNpbXBsZSBzdGVwcyE8L3A+XG4gICAgICBcbiAgICAgIDxBdXRoRmxvdyBvbjp0b2tlbkdlbmVyYXRlZD17KGV2ZW50KSA9PiB7XG4gICAgICAgIHNldHRpbmdzLm5ldGxpZnlUb2tlbiA9IGV2ZW50LmRldGFpbC50b2tlbjtcbiAgICAgICAgdmFsaWRhdGVUb2tlbigpO1xuICAgICAgfX0gLz5cbiAgICAgIFxuICAgICAgeyNpZiB0b2tlblZhbGlkYXRlZH1cbiAgICAgICAgPGRpdiBjbGFzcz1cInNldHVwLXNlY3Rpb25cIj5cbiAgICAgICAgICA8aDM+U3RlcCAyOiBDaG9vc2UgYSBTaXRlIE5hbWU8L2gzPlxuICAgICAgICAgIDxwPlRoaXMgd2lsbCBiZSBwYXJ0IG9mIHlvdXIgc2l0ZSdzIFVSTDogPGNvZGU+aHR0cHM6Ly9bc2l0ZS1uYW1lXS5uZXRsaWZ5LmFwcDwvY29kZT48L3A+XG4gICAgICAgICAgXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInNpdGUtbmFtZS1pbnB1dFwiPlxuICAgICAgICAgICAgPGlucHV0IFxuICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiIFxuICAgICAgICAgICAgICBiaW5kOnZhbHVlPXtzZXR0aW5ncy5zaXRlTmFtZX0gXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwibXktYXdlc29tZS1zbGlkZXNcIiBcbiAgICAgICAgICAgICAgb246Y2hhbmdlPXtoYW5kbGVTZXR0aW5nc0NoYW5nZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXtnZW5lcmF0ZVNpdGVOYW1lc30gY2xhc3M9XCJzaXRlLW5hbWUtZ2VuZXJhdG9yLWJ1dHRvblwiPlxuICAgICAgICAgICAgICB7aXNHZW5lcmF0aW5nTmFtZXMgPyAnR2VuZXJhdGluZy4uLicgOiAnR2VuZXJhdGUnfVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgXG4gICAgICAgICAgeyNpZiBnZW5lcmF0ZWROYW1lcy5sZW5ndGggPiAwfVxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdlbmVyYXRlZC1uYW1lc1wiPlxuICAgICAgICAgICAgICA8cD5TdWdnZXN0aW9uczo8L3A+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJuYW1lLXN1Z2dlc3Rpb25zXCI+XG4gICAgICAgICAgICAgICAgeyNlYWNoIGdlbmVyYXRlZE5hbWVzIGFzIG5hbWV9XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInN1Z2dlc3RlZC1uYW1lXCIgXG4gICAgICAgICAgICAgICAgICAgIG9uOmNsaWNrPXsoKSA9PiBzZWxlY3RTaXRlTmFtZShuYW1lKX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge25hbWV9XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICB7L2VhY2h9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgey9pZn1cbiAgICAgICAgICBcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic2l0ZS1wcmV2aWV3XCI+XG4gICAgICAgICAgICA8cD5Zb3VyIHNpdGUgd2lsbCBiZSBhdmFpbGFibGUgYXQ6PC9wPlxuICAgICAgICAgICAgPGNvZGU+aHR0cHM6Ly97c2V0dGluZ3Muc2l0ZU5hbWUgfHwgJ3lvdXItc2l0ZS1uYW1lJ30ubmV0bGlmeS5hcHA8L2NvZGU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBcbiAgICAgICAgPGRpdiBjbGFzcz1cInNldHVwLXNlY3Rpb25cIj5cbiAgICAgICAgICA8aDM+U3RlcCAzOiBEZXBsb3ltZW50IE9wdGlvbnM8L2gzPlxuICAgICAgICAgIFxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJzZXR0aW5nLWl0ZW1cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzZXR0aW5nLWxhYmVsXCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJkZXBsb3ltZW50LXRoZW1lXCI+VGhlbWU6PC9sYWJlbD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNldHRpbmctY29udHJvbFwiPlxuICAgICAgICAgICAgICA8c2VsZWN0IFxuICAgICAgICAgICAgICAgIGlkPVwiZGVwbG95bWVudC10aGVtZVwiIFxuICAgICAgICAgICAgICAgIGJpbmQ6dmFsdWU9e3NldHRpbmdzLmRlcGxveW1lbnRUaGVtZX0gXG4gICAgICAgICAgICAgICAgb246Y2hhbmdlPXtoYW5kbGVTZXR0aW5nc0NoYW5nZX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHsjZWFjaCB0aGVtZXMgYXMgdGhlbWV9XG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXt0aGVtZS5pZH0+e3RoZW1lLm5hbWV9PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgey9lYWNofVxuICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIFxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJzZXR0aW5nLWl0ZW1cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzZXR0aW5nLWxhYmVsXCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJ1c2UtY3VzdG9tLWRvbWFpblwiPlVzZSBDdXN0b20gRG9tYWluOjwvbGFiZWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzZXR0aW5nLWNvbnRyb2xcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvZ2dsZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIiBcbiAgICAgICAgICAgICAgICAgIGlkPVwidXNlLWN1c3RvbS1kb21haW5cIiBcbiAgICAgICAgICAgICAgICAgIGJpbmQ6Y2hlY2tlZD17c2V0dGluZ3MudXNlQ3VzdG9tRG9tYWlufSBcbiAgICAgICAgICAgICAgICAgIG9uOmNoYW5nZT17aGFuZGxlU2V0dGluZ3NDaGFuZ2V9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJ0b2dnbGVcIiBmb3I9XCJ1c2UtY3VzdG9tLWRvbWFpblwiPjwvbGFiZWw+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgXG4gICAgICAgICAgeyNpZiBzZXR0aW5ncy51c2VDdXN0b21Eb21haW59XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2V0dGluZy1pdGVtIGluZGVudGVkXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzZXR0aW5nLWxhYmVsXCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImN1c3RvbS1kb21haW5cIj5DdXN0b20gRG9tYWluOjwvbGFiZWw+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2V0dGluZy1jb250cm9sXCI+XG4gICAgICAgICAgICAgICAgPGlucHV0IFxuICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIiBcbiAgICAgICAgICAgICAgICAgIGlkPVwiY3VzdG9tLWRvbWFpblwiIFxuICAgICAgICAgICAgICAgICAgYmluZDp2YWx1ZT17c2V0dGluZ3MuY3VzdG9tRG9tYWlufSBcbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwic2xpZGVzLnlvdXJkb21haW4uY29tXCIgXG4gICAgICAgICAgICAgICAgICBvbjpjaGFuZ2U9e2hhbmRsZVNldHRpbmdzQ2hhbmdlfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8cCBjbGFzcz1cImluZm8tdGV4dFwiPlxuICAgICAgICAgICAgICBOb3RlOiBZb3UnbGwgbmVlZCB0byBjb25maWd1cmUgRE5TIHNldHRpbmdzIGluIHlvdXIgZG9tYWluIHByb3ZpZGVyJ3MgZGFzaGJvYXJkXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgey9pZn1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiY29tcGxldGUtc2V0dXAtYnV0dG9uXCIgb246Y2xpY2s9e2NvbXBsZXRlU2V0dXB9PlxuICAgICAgICAgIENvbXBsZXRlIFNldHVwXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgey9pZn1cbiAgICA8L2Rpdj5cbiAgezplbHNlfVxuICAgIDwhLS0gUmVndWxhciBzZXR0aW5ncyB2aWV3IGFmdGVyIHNldHVwIGlzIGNvbXBsZXRlIC0tPlxuICAgIDxkaXYgY2xhc3M9XCJzZXR0aW5ncy1jb250YWluZXJcIj5cbiAgICAgIDxoMj5OZXRsaWZ5IERlcGxveW1lbnQgU2V0dGluZ3M8L2gyPlxuICAgICAgXG4gICAgICA8ZGl2IGNsYXNzPVwic2V0dGluZy1zZWN0aW9uXCI+XG4gICAgICAgIDxoMz5BdXRoZW50aWNhdGlvbjwvaDM+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzZXR0aW5nLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic2V0dGluZy1sYWJlbFwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cIm5ldGxpZnktdG9rZW5cIj5OZXRsaWZ5IFBlcnNvbmFsIEFjY2VzcyBUb2tlbjo8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJzZXR0aW5nLWNvbnRyb2wgdG9rZW4taW5wdXRcIj5cbiAgICAgICAgICAgIDxpbnB1dCBcbiAgICAgICAgICAgICAgdHlwZT1cInBhc3N3b3JkXCIgXG4gICAgICAgICAgICAgIGlkPVwibmV0bGlmeS10b2tlblwiIFxuICAgICAgICAgICAgICBiaW5kOnZhbHVlPXtzZXR0aW5ncy5uZXRsaWZ5VG9rZW59IFxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIllvdXIgTmV0bGlmeSB0b2tlblwiIFxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxidXR0b24gb246Y2xpY2s9e3ZhbGlkYXRlVG9rZW59IGNsYXNzPVwidmFsaWRhdGUtYnV0dG9uXCI+XG4gICAgICAgICAgICAgIHtpc1ZhbGlkYXRpbmdUb2tlbiA/ICdWYWxpZGF0aW5nLi4uJyA6ICdWYWxpZGF0ZSd9XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7I2lmIHZhbGlkYXRpb25NZXNzYWdlfVxuICAgICAgICAgICAgPHAgY2xhc3M9XCJ2YWxpZGF0aW9uLW1lc3NhZ2Uge3Rva2VuVmFsaWRhdGVkID8gJ3N1Y2Nlc3MnIDogJ2Vycm9yJ31cIj5cbiAgICAgICAgICAgICAge3ZhbGlkYXRpb25NZXNzYWdlfVxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIHsvaWZ9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICBcbiAgICAgIDxkaXYgY2xhc3M9XCJzZXR0aW5nLXNlY3Rpb25cIj5cbiAgICAgICAgPGgzPlNpdGUgQ29uZmlndXJhdGlvbjwvaDM+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzZXR0aW5nLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic2V0dGluZy1sYWJlbFwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInNpdGUtbmFtZVwiPlNpdGUgTmFtZTo8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJzZXR0aW5nLWNvbnRyb2xcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzaXRlLW5hbWUtaW5wdXRcIj5cbiAgICAgICAgICAgICAgPGlucHV0IFxuICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCIgXG4gICAgICAgICAgICAgICAgaWQ9XCJzaXRlLW5hbWVcIiBcbiAgICAgICAgICAgICAgICBiaW5kOnZhbHVlPXtzZXR0aW5ncy5zaXRlTmFtZX0gXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJteS1hd2Vzb21lLXNsaWRlc1wiIFxuICAgICAgICAgICAgICAgIG9uOmNoYW5nZT17aGFuZGxlU2V0dGluZ3NDaGFuZ2V9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxidXR0b24gb246Y2xpY2s9e2dlbmVyYXRlU2l0ZU5hbWVzfSBjbGFzcz1cInNpdGUtbmFtZS1nZW5lcmF0b3ItYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAge2lzR2VuZXJhdGluZ05hbWVzID8gJ0dlbmVyYXRpbmcuLi4nIDogJ0dlbmVyYXRlJ31cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgeyNpZiBnZW5lcmF0ZWROYW1lcy5sZW5ndGggPiAwfVxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2VuZXJhdGVkLW5hbWVzXCI+XG4gICAgICAgICAgICAgICAgPHA+U3VnZ2VzdGlvbnM6PC9wPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJuYW1lLXN1Z2dlc3Rpb25zXCI+XG4gICAgICAgICAgICAgICAgICB7I2VhY2ggZ2VuZXJhdGVkTmFtZXMgYXMgbmFtZX1cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInN1Z2dlc3RlZC1uYW1lXCIgXG4gICAgICAgICAgICAgICAgICAgICAgb246Y2xpY2s9eygpID0+IHNlbGVjdFNpdGVOYW1lKG5hbWUpfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAge25hbWV9XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgey9lYWNofVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIHsvaWZ9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzaXRlLXByZXZpZXdcIj5cbiAgICAgICAgICAgICAgPHA+WW91ciBzaXRlIHdpbGwgYmUgYXZhaWxhYmxlIGF0OjwvcD5cbiAgICAgICAgICAgICAgPGNvZGU+aHR0cHM6Ly97c2V0dGluZ3Muc2l0ZU5hbWUgfHwgJ3lvdXItc2l0ZS1uYW1lJ30ubmV0bGlmeS5hcHA8L2NvZGU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8ZGl2IGNsYXNzPVwic2V0dGluZy1pdGVtXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInNldHRpbmctbGFiZWxcIj5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJkZXBsb3ltZW50LXRoZW1lXCI+VGhlbWU6PC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic2V0dGluZy1jb250cm9sXCI+XG4gICAgICAgICAgICA8c2VsZWN0IFxuICAgICAgICAgICAgICBpZD1cImRlcGxveW1lbnQtdGhlbWVcIiBcbiAgICAgICAgICAgICAgYmluZDp2YWx1ZT17c2V0dGluZ3MuZGVwbG95bWVudFRoZW1lfSBcbiAgICAgICAgICAgICAgb246Y2hhbmdlPXtoYW5kbGVTZXR0aW5nc0NoYW5nZX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgeyNlYWNoIHRoZW1lcyBhcyB0aGVtZX1cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXt0aGVtZS5pZH0+e3RoZW1lLm5hbWV9PC9vcHRpb24+XG4gICAgICAgICAgICAgIHsvZWFjaH1cbiAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzZXR0aW5nLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic2V0dGluZy1sYWJlbFwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInVzZS1jdXN0b20tZG9tYWluXCI+VXNlIEN1c3RvbSBEb21haW46PC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic2V0dGluZy1jb250cm9sXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidG9nZ2xlLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCIgXG4gICAgICAgICAgICAgICAgaWQ9XCJ1c2UtY3VzdG9tLWRvbWFpblwiIFxuICAgICAgICAgICAgICAgIGJpbmQ6Y2hlY2tlZD17c2V0dGluZ3MudXNlQ3VzdG9tRG9tYWlufSBcbiAgICAgICAgICAgICAgICBvbjpjaGFuZ2U9e2hhbmRsZVNldHRpbmdzQ2hhbmdlfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJ0b2dnbGVcIiBmb3I9XCJ1c2UtY3VzdG9tLWRvbWFpblwiPjwvbGFiZWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICB7I2lmIHNldHRpbmdzLnVzZUN1c3RvbURvbWFpbn1cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic2V0dGluZy1pdGVtIGluZGVudGVkXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2V0dGluZy1sYWJlbFwiPlxuICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiY3VzdG9tLWRvbWFpblwiPkN1c3RvbSBEb21haW46PC9sYWJlbD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNldHRpbmctY29udHJvbFwiPlxuICAgICAgICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIiBcbiAgICAgICAgICAgICAgICBpZD1cImN1c3RvbS1kb21haW5cIiBcbiAgICAgICAgICAgICAgICBiaW5kOnZhbHVlPXtzZXR0aW5ncy5jdXN0b21Eb21haW59IFxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwic2xpZGVzLnlvdXJkb21haW4uY29tXCIgXG4gICAgICAgICAgICAgICAgb246Y2hhbmdlPXtoYW5kbGVTZXR0aW5nc0NoYW5nZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxwIGNsYXNzPVwiaW5mby10ZXh0XCI+XG4gICAgICAgICAgICBOb3RlOiBZb3UnbGwgbmVlZCB0byBjb25maWd1cmUgRE5TIHNldHRpbmdzIGluIHlvdXIgZG9tYWluIHByb3ZpZGVyJ3MgZGFzaGJvYXJkXG4gICAgICAgICAgPC9wPlxuICAgICAgICB7L2lmfVxuICAgICAgPC9kaXY+XG4gICAgICBcbiAgICAgIHsjaWYgZGVwbG95bWVudEhpc3RvcnkubGVuZ3RoID4gMH1cbiAgICAgICAgPGRpdiBjbGFzcz1cInNldHRpbmctc2VjdGlvblwiPlxuICAgICAgICAgIDxoMz5EZXBsb3ltZW50IEhpc3Rvcnk8L2gzPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZXBsb3ltZW50LWhpc3RvcnlcIj5cbiAgICAgICAgICAgIHsjZWFjaCBkZXBsb3ltZW50SGlzdG9yeSBhcyBkZXBsb3ltZW50fVxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVwbG95bWVudC1pdGVtXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlcGxveW1lbnQtaW5mb1wiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlcGxveW1lbnQtbmFtZVwiPntkZXBsb3ltZW50Lm5hbWV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVwbG95bWVudC1kYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIHtuZXcgRGF0ZShkZXBsb3ltZW50LnRpbWVzdGFtcCkudG9Mb2NhbGVTdHJpbmcoKX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlcGxveW1lbnQtc3RhdHVzIHtkZXBsb3ltZW50LnN0YXR1c31cIj5cbiAgICAgICAgICAgICAgICAgICAge2RlcGxveW1lbnQuc3RhdHVzfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlcGxveW1lbnQtYWN0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgPGEgaHJlZj17ZGVwbG95bWVudC51cmx9IHRhcmdldD1cIl9ibGFua1wiIGNsYXNzPVwiZGVwbG95bWVudC1saW5rXCI+XG4gICAgICAgICAgICAgICAgICAgIFZpZXcgU2l0ZVxuICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIHsvZWFjaH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICB7L2lmfVxuICAgICAgXG4gICAgICA8ZGl2IGNsYXNzPVwic2V0dGluZy1zZWN0aW9uXCI+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJyZXNldC1idXR0b25cIiBvbjpjbGljaz17KCkgPT4ge1xuICAgICAgICAgIHNob3dTZXR1cFdpemFyZCA9IHRydWU7XG4gICAgICAgICAgc2V0dGluZ3MuaGFzQ29tcGxldGVkU2V0dXAgPSBmYWxzZTtcbiAgICAgICAgICBzYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgfX0+XG4gICAgICAgICAgUmVzdGFydCBTZXR1cCBXaXphcmRcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgey9pZn1cbjwvZGl2PlxuXG48c3R5bGU+XG4gIC5hZHZhbmNlZC1zbGlkZXMtbmV0bGlmeS1zZXR0aW5ncyB7XG4gICAgcGFkZGluZzogMCAxcmVtO1xuICB9XG4gIFxuICBoMiB7XG4gICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIH1cbiAgXG4gIGgzIHtcbiAgICBtYXJnaW4tdG9wOiAxLjVyZW07XG4gICAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xuICAgIGZvbnQtc2l6ZTogMS4xcmVtO1xuICB9XG4gIFxuICAuc2V0dXAtd2l6YXJkIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgZ2FwOiAxcmVtO1xuICB9XG4gIFxuICAuc2V0dXAtc2VjdGlvbiB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tYmFja2dyb3VuZC1zZWNvbmRhcnkpO1xuICAgIHBhZGRpbmc6IDFyZW07XG4gICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgIG1hcmdpbi1ib3R0b206IDFyZW07XG4gIH1cbiAgXG4gIC5zZXR0aW5nLWl0ZW0ge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuICB9XG4gIFxuICAuc2V0dGluZy1sYWJlbCB7XG4gICAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIH1cbiAgXG4gIC5zZXR0aW5nLWNvbnRyb2wge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgfVxuICBcbiAgaW5wdXRbdHlwZT1cInRleHRcIl0sXG4gIGlucHV0W3R5cGU9XCJwYXNzd29yZFwiXSxcbiAgc2VsZWN0IHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iYWNrZ3JvdW5kLXByaW1hcnkpO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWJhY2tncm91bmQtbW9kaWZpZXItYm9yZGVyKTtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgcGFkZGluZzogMC41cmVtO1xuICAgIHdpZHRoOiAxMDAlO1xuICB9XG4gIFxuICAuc2l0ZS1uYW1lLWlucHV0IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGdhcDogMC41cmVtO1xuICB9XG4gIFxuICAudG9rZW4taW5wdXQge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZ2FwOiAwLjVyZW07XG4gIH1cbiAgXG4gIGJ1dHRvbiB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0taW50ZXJhY3RpdmUtYWNjZW50KTtcbiAgICBjb2xvcjogdmFyKC0tdGV4dC1vbi1hY2NlbnQpO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgcGFkZGluZzogMC41cmVtIDFyZW07XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycztcbiAgfVxuICBcbiAgYnV0dG9uOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1pbnRlcmFjdGl2ZS1hY2NlbnQtaG92ZXIpO1xuICB9XG4gIFxuICAuY29tcGxldGUtc2V0dXAtYnV0dG9uIHtcbiAgICBtYXJnaW4tdG9wOiAxcmVtO1xuICAgIHBhZGRpbmc6IDAuNzVyZW07XG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIH1cbiAgXG4gIC5yZXNldC1idXR0b24ge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWJhY2tncm91bmQtbW9kaWZpZXItZXJyb3IpO1xuICB9XG4gIFxuICAuaW5mby10ZXh0IHtcbiAgICBmb250LXNpemU6IDAuOHJlbTtcbiAgICBvcGFjaXR5OiAwLjg7XG4gICAgbWFyZ2luLXRvcDogMC4yNXJlbTtcbiAgfVxuICBcbiAgLnZhbGlkYXRpb24tbWVzc2FnZSB7XG4gICAgbWFyZ2luLXRvcDogMC41cmVtO1xuICAgIGZvbnQtc2l6ZTogMC45cmVtO1xuICB9XG4gIFxuICAudmFsaWRhdGlvbi1tZXNzYWdlLnN1Y2Nlc3Mge1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LXN1Y2Nlc3MpO1xuICB9XG4gIFxuICAudmFsaWRhdGlvbi1tZXNzYWdlLmVycm9yIHtcbiAgICBjb2xvcjogdmFyKC0tdGV4dC1lcnJvcik7XG4gIH1cbiAgXG4gIC50b2dnbGUtY29udGFpbmVyIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIHdpZHRoOiA0MHB4O1xuICAgIGhlaWdodDogMjBweDtcbiAgfVxuICBcbiAgLnRvZ2dsZS1jb250YWluZXIgaW5wdXQge1xuICAgIG9wYWNpdHk6IDA7XG4gICAgd2lkdGg6IDA7XG4gICAgaGVpZ2h0OiAwO1xuICB9XG4gIFxuICAudG9nZ2xlIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHRvcDogMDtcbiAgICBsZWZ0OiAwO1xuICAgIHJpZ2h0OiAwO1xuICAgIGJvdHRvbTogMDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iYWNrZ3JvdW5kLW1vZGlmaWVyLWJvcmRlcik7XG4gICAgdHJhbnNpdGlvbjogLjRzO1xuICAgIGJvcmRlci1yYWRpdXM6IDIwcHg7XG4gIH1cbiAgXG4gIC50b2dnbGU6YmVmb3JlIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgY29udGVudDogXCJcIjtcbiAgICBoZWlnaHQ6IDE2cHg7XG4gICAgd2lkdGg6IDE2cHg7XG4gICAgbGVmdDogMnB4O1xuICAgIGJvdHRvbTogMnB4O1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJhY2tncm91bmQtcHJpbWFyeSk7XG4gICAgdHJhbnNpdGlvbjogLjRzO1xuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgfVxuICBcbiAgaW5wdXQ6Y2hlY2tlZCArIC50b2dnbGUge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWludGVyYWN0aXZlLWFjY2VudCk7XG4gIH1cbiAgXG4gIGlucHV0OmNoZWNrZWQgKyAudG9nZ2xlOmJlZm9yZSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDIwcHgpO1xuICB9XG4gIFxuICAuZ2VuZXJhdGVkLW5hbWVzIHtcbiAgICBtYXJnaW4tdG9wOiAwLjVyZW07XG4gIH1cbiAgXG4gIC5uYW1lLXN1Z2dlc3Rpb25zIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtd3JhcDogd3JhcDtcbiAgICBnYXA6IDAuNXJlbTtcbiAgICBtYXJnaW4tdG9wOiAwLjI1cmVtO1xuICB9XG4gIFxuICAuc3VnZ2VzdGVkLW5hbWUge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWJhY2tncm91bmQtc2Vjb25kYXJ5LWFsdCk7XG4gICAgY29sb3I6IHZhcigtLXRleHQtbm9ybWFsKTtcbiAgICBmb250LXNpemU6IDAuOHJlbTtcbiAgICBwYWRkaW5nOiAwLjI1cmVtIDAuNXJlbTtcbiAgfVxuICBcbiAgLnNpdGUtcHJldmlldyB7XG4gICAgbWFyZ2luLXRvcDogMC41cmVtO1xuICAgIGZvbnQtc2l6ZTogMC45cmVtO1xuICB9XG4gIFxuICAuaW5kZW50ZWQge1xuICAgIG1hcmdpbi1sZWZ0OiAxLjVyZW07XG4gIH1cbiAgXG4gIC5kZXBsb3ltZW50LWhpc3Rvcnkge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBnYXA6IDAuNXJlbTtcbiAgfVxuICBcbiAgLmRlcGxveW1lbnQtaXRlbSB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iYWNrZ3JvdW5kLXNlY29uZGFyeSk7XG4gICAgcGFkZGluZzogMC43NXJlbTtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIH1cbiAgXG4gIC5kZXBsb3ltZW50LWluZm8ge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBnYXA6IDAuMjVyZW07XG4gIH1cbiAgXG4gIC5kZXBsb3ltZW50LW5hbWUge1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIH1cbiAgXG4gIC5kZXBsb3ltZW50LWRhdGUge1xuICAgIGZvbnQtc2l6ZTogMC44cmVtO1xuICAgIG9wYWNpdHk6IDAuODtcbiAgfVxuICBcbiAgLmRlcGxveW1lbnQtc3RhdHVzIHtcbiAgICBmb250LXNpemU6IDAuN3JlbTtcbiAgICBwYWRkaW5nOiAwLjFyZW0gMC4zcmVtO1xuICAgIGJvcmRlci1yYWRpdXM6IDNweDtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgd2lkdGg6IGZpdC1jb250ZW50O1xuICB9XG4gIFxuICAuZGVwbG95bWVudC1zdGF0dXMuc3VjY2VzcyB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tdGV4dC1zdWNjZXNzKTtcbiAgICBjb2xvcjogdmFyKC0tYmFja2dyb3VuZC1wcmltYXJ5KTtcbiAgfVxuICBcbiAgLmRlcGxveW1lbnQtc3RhdHVzLmVycm9yIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS10ZXh0LWVycm9yKTtcbiAgICBjb2xvcjogdmFyKC0tYmFja2dyb3VuZC1wcmltYXJ5KTtcbiAgfVxuICBcbiAgLmRlcGxveW1lbnQtc3RhdHVzLnBlbmRpbmcge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXRleHQtd2FybmluZyk7XG4gICAgY29sb3I6IHZhcigtLWJhY2tncm91bmQtcHJpbWFyeSk7XG4gIH1cbiAgXG4gIC5kZXBsb3ltZW50LWxpbmsge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWludGVyYWN0aXZlLW5vcm1hbCk7XG4gICAgY29sb3I6IHZhcigtLXRleHQtbm9ybWFsKTtcbiAgICBwYWRkaW5nOiAwLjNyZW0gMC42cmVtO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICBmb250LXNpemU6IDAuOHJlbTtcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIH1cbiAgXG4gIC5kZXBsb3ltZW50LWxpbms6aG92ZXIge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWludGVyYWN0aXZlLWhvdmVyKTtcbiAgfVxuPC9zdHlsZT4iLCI8c2NyaXB0IGxhbmc9XCJ0c1wiPlxuICB0eXBlIERlcGxveW1lbnRTdGF0dXMgPSAncHJlcGFyaW5nJyB8ICdleHBvcnRpbmcnIHwgJ2RlcGxveWluZycgfCAnc3VjY2VzcycgfCAnZXJyb3InO1xuICBcbiAgZXhwb3J0IGxldCBzdGF0dXM6IERlcGxveW1lbnRTdGF0dXMgPSAncHJlcGFyaW5nJztcbiAgZXhwb3J0IGxldCBwcm9ncmVzczogbnVtYmVyID0gMDtcbiAgZXhwb3J0IGxldCBlcnJvcjogc3RyaW5nID0gJyc7XG4gIGV4cG9ydCBsZXQgdXJsOiBzdHJpbmcgPSAnJztcbiAgZXhwb3J0IGxldCBzdGFydFRpbWU6IG51bWJlciA9IERhdGUubm93KCk7XG4gIGV4cG9ydCBsZXQgZW5kVGltZTogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gIGV4cG9ydCBsZXQgZm9ybWF0RHVyYXRpb246ICgpID0+IHN0cmluZyA9ICgpID0+ICcwMDowMCc7XG4gIFxuICAvLyBDYWxjdWxhdGUgZWxhcHNlZCB0aW1lXG4gIGxldCBlbGFwc2VkVGltZSA9IDA7XG4gIGxldCB0aW1lcjogbnVtYmVyO1xuICBcbiAgLy8gVXBkYXRlIHRpbWVyIHdoZW4gY29tcG9uZW50IG1vdW50c1xuICBpbXBvcnQgeyBvbk1vdW50LCBvbkRlc3Ryb3kgfSBmcm9tICdzdmVsdGUnO1xuICBcbiAgb25Nb3VudCgoKSA9PiB7XG4gICAgdGltZXIgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgaWYgKHN0YXR1cyAhPT0gJ3N1Y2Nlc3MnICYmIHN0YXR1cyAhPT0gJ2Vycm9yJykge1xuICAgICAgICBlbGFwc2VkVGltZSA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBzdGFydFRpbWUpIC8gMTAwMCk7XG4gICAgICB9XG4gICAgfSwgMTAwMCk7XG4gIH0pO1xuICBcbiAgb25EZXN0cm95KCgpID0+IHtcbiAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgfSk7XG4gIFxuICAvLyBGb3JtYXQgdGltZSBhcyBtbTpzc1xuICBmdW5jdGlvbiBmb3JtYXRUaW1lKHNlY29uZHM6IG51bWJlcik6IHN0cmluZyB7XG4gICAgY29uc3QgbWlucyA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICBjb25zdCBzZWNzID0gc2Vjb25kcyAlIDYwO1xuICAgIHJldHVybiBgJHttaW5zLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKX06JHtzZWNzLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKX1gO1xuICB9XG4gIFxuICAvLyBTdGF0dXMgbWVzc2FnZXNcbiAgY29uc3Qgc3RhdHVzTWVzc2FnZXM6IFJlY29yZDxEZXBsb3ltZW50U3RhdHVzLCBzdHJpbmc+ID0ge1xuICAgIHByZXBhcmluZzogJ1ByZXBhcmluZyB0byBkZXBsb3kuLi4nLFxuICAgIGV4cG9ydGluZzogJ0V4cG9ydGluZyBzbGlkZXMuLi4nLFxuICAgIGRlcGxveWluZzogJ1VwbG9hZGluZyB0byBOZXRsaWZ5Li4uJyxcbiAgICBzdWNjZXNzOiAnRGVwbG95bWVudCBzdWNjZXNzZnVsIScsXG4gICAgZXJyb3I6ICdEZXBsb3ltZW50IGZhaWxlZCdcbiAgfTtcbjwvc2NyaXB0PlxuXG48ZGl2IGNsYXNzPVwiZGVwbG95bWVudC1zdGF0dXMge3N0YXR1c31cIj5cbiAgPGRpdiBjbGFzcz1cInN0YXR1cy1oZWFkZXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwic3RhdHVzLWluZGljYXRvclwiPlxuICAgICAgeyNpZiBzdGF0dXMgPT09ICdwcmVwYXJpbmcnIHx8IHN0YXR1cyA9PT0gJ2V4cG9ydGluZycgfHwgc3RhdHVzID09PSAnZGVwbG95aW5nJ31cbiAgICAgICAgPGRpdiBjbGFzcz1cInNwaW5uZXJcIj48L2Rpdj5cbiAgICAgIHs6ZWxzZSBpZiBzdGF0dXMgPT09ICdzdWNjZXNzJ31cbiAgICAgICAgPGRpdiBjbGFzcz1cInN1Y2Nlc3MtaWNvblwiPuKckzwvZGl2PlxuICAgICAgezplbHNlIGlmIHN0YXR1cyA9PT0gJ2Vycm9yJ31cbiAgICAgICAgPGRpdiBjbGFzcz1cImVycm9yLWljb25cIj7inJU8L2Rpdj5cbiAgICAgIHsvaWZ9XG4gICAgICA8ZGl2IGNsYXNzPVwic3RhdHVzLW1lc3NhZ2VcIj57c3RhdHVzTWVzc2FnZXNbc3RhdHVzXX08L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZWxhcHNlZC10aW1lXCI+e2Zvcm1hdER1cmF0aW9uKCl9PC9kaXY+XG4gIDwvZGl2PlxuICBcbiAgeyNpZiBzdGF0dXMgIT09ICdzdWNjZXNzJyAmJiBzdGF0dXMgIT09ICdlcnJvcid9XG4gICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNvbnRhaW5lclwiPlxuICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIHN0eWxlPVwid2lkdGg6IHtwcm9ncmVzc30lXCI+PC9kaXY+XG4gICAgPC9kaXY+XG4gIHsvaWZ9XG4gIFxuICB7I2lmIHN0YXR1cyA9PT0gJ3N1Y2Nlc3MnICYmIHVybH1cbiAgICA8ZGl2IGNsYXNzPVwic3VjY2Vzcy1kZXRhaWxzXCI+XG4gICAgICA8cD5Zb3VyIHByZXNlbnRhdGlvbiBpcyBub3cgbGl2ZSBhdDo8L3A+XG4gICAgICA8YSBocmVmPXt1cmx9IHRhcmdldD1cIl9ibGFua1wiIGNsYXNzPVwiZGVwbG95bWVudC11cmxcIj57dXJsfTwvYT5cbiAgICA8L2Rpdj5cbiAgezplbHNlIGlmIHN0YXR1cyA9PT0gJ2Vycm9yJyAmJiBlcnJvcn1cbiAgICA8ZGl2IGNsYXNzPVwiZXJyb3ItZGV0YWlsc1wiPlxuICAgICAgPHA+RXJyb3I6IHtlcnJvcn08L3A+XG4gICAgICA8ZGl2IGNsYXNzPVwidHJvdWJsZXNob290aW5nLXRpcHNcIj5cbiAgICAgICAgPHA+PHN0cm9uZz5Ucm91Ymxlc2hvb3RpbmcgdGlwczo8L3N0cm9uZz48L3A+XG4gICAgICAgIDx1bD5cbiAgICAgICAgICA8bGk+Q2hlY2sgeW91ciBOZXRsaWZ5IGF1dGhlbnRpY2F0aW9uIHRva2VuPC9saT5cbiAgICAgICAgICA8bGk+RW5zdXJlIEFkdmFuY2VkIFNsaWRlcyBwbHVnaW4gaXMgaW5zdGFsbGVkIGFuZCBhY3RpdmU8L2xpPlxuICAgICAgICAgIDxsaT5DaGVjayB5b3VyIGludGVybmV0IGNvbm5lY3Rpb248L2xpPlxuICAgICAgICAgIDxsaT5UcnkgYWdhaW4gaW4gYSBmZXcgbWludXRlczwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgey9pZn1cbjwvZGl2PlxuXG48c3R5bGU+XG4gIC5kZXBsb3ltZW50LXN0YXR1cyB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tYmFja2dyb3VuZC1zZWNvbmRhcnkpO1xuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICBwYWRkaW5nOiAxLjVyZW07XG4gICAgbWFyZ2luLXRvcDogMXJlbTtcbiAgfVxuICBcbiAgLnN0YXR1cy1oZWFkZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbiAgfVxuICBcbiAgLnN0YXR1cy1pbmRpY2F0b3Ige1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgfVxuICBcbiAgLnNwaW5uZXIge1xuICAgIHdpZHRoOiAyMHB4O1xuICAgIGhlaWdodDogMjBweDtcbiAgICBib3JkZXI6IDNweCBzb2xpZCB2YXIoLS1iYWNrZ3JvdW5kLW1vZGlmaWVyLWJvcmRlcik7XG4gICAgYm9yZGVyLXRvcC1jb2xvcjogdmFyKC0taW50ZXJhY3RpdmUtYWNjZW50KTtcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgYW5pbWF0aW9uOiBzcGluIDFzIGxpbmVhciBpbmZpbml0ZTtcbiAgICBtYXJnaW4tcmlnaHQ6IDAuNzVyZW07XG4gIH1cbiAgXG4gIEBrZXlmcmFtZXMgc3BpbiB7XG4gICAgdG8geyB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpOyB9XG4gIH1cbiAgXG4gIC5zdWNjZXNzLWljb24ge1xuICAgIHdpZHRoOiAyMHB4O1xuICAgIGhlaWdodDogMjBweDtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS10ZXh0LXN1Y2Nlc3MpO1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIG1hcmdpbi1yaWdodDogMC43NXJlbTtcbiAgICBmb250LXdlaWdodDogYm9sZDtcbiAgfVxuICBcbiAgLmVycm9yLWljb24ge1xuICAgIHdpZHRoOiAyMHB4O1xuICAgIGhlaWdodDogMjBweDtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS10ZXh0LWVycm9yKTtcbiAgICBjb2xvcjogd2hpdGU7XG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBtYXJnaW4tcmlnaHQ6IDAuNzVyZW07XG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIH1cbiAgXG4gIC5zdGF0dXMtbWVzc2FnZSB7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgfVxuICBcbiAgLmVsYXBzZWQtdGltZSB7XG4gICAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZTtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iYWNrZ3JvdW5kLXByaW1hcnkpO1xuICAgIHBhZGRpbmc6IDAuMjVyZW0gMC41cmVtO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICBmb250LXNpemU6IDAuOHJlbTtcbiAgfVxuICBcbiAgLnByb2dyZXNzLWNvbnRhaW5lciB7XG4gICAgaGVpZ2h0OiA4cHg7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tYmFja2dyb3VuZC1tb2RpZmllci1ib3JkZXIpO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIG1hcmdpbi1ib3R0b206IDFyZW07XG4gIH1cbiAgXG4gIC5wcm9ncmVzcy1iYXIge1xuICAgIGhlaWdodDogMTAwJTtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1pbnRlcmFjdGl2ZS1hY2NlbnQpO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICB0cmFuc2l0aW9uOiB3aWR0aCAwLjNzIGVhc2U7XG4gIH1cbiAgXG4gIC5zdWNjZXNzLWRldGFpbHMsIC5lcnJvci1kZXRhaWxzIHtcbiAgICBtYXJnaW4tdG9wOiAxcmVtO1xuICB9XG4gIFxuICAuZGVwbG95bWVudC11cmwge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWJhY2tncm91bmQtcHJpbWFyeSk7XG4gICAgcGFkZGluZzogMC43NXJlbTtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgd29yZC1icmVhazogYnJlYWstYWxsO1xuICAgIG1hcmdpbi10b3A6IDAuNXJlbTtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgY29sb3I6IHZhcigtLWludGVyYWN0aXZlLWFjY2VudCk7XG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIH1cbiAgXG4gIC5kZXBsb3ltZW50LXVybDpob3ZlciB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tYmFja2dyb3VuZC1wcmltYXJ5LWFsdCk7XG4gIH1cbiAgXG4gIC50cm91Ymxlc2hvb3RpbmctdGlwcyB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tYmFja2dyb3VuZC1wcmltYXJ5KTtcbiAgICBwYWRkaW5nOiAxcmVtO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICBtYXJnaW4tdG9wOiAxcmVtO1xuICAgIGZvbnQtc2l6ZTogMC45cmVtO1xuICB9XG4gIFxuICAudHJvdWJsZXNob290aW5nLXRpcHMgdWwge1xuICAgIG1hcmdpbjogMC41cmVtIDAgMCAxLjVyZW07XG4gICAgcGFkZGluZzogMDtcbiAgfVxuICBcbiAgLnRyb3VibGVzaG9vdGluZy10aXBzIGxpIHtcbiAgICBtYXJnaW4tYm90dG9tOiAwLjI1cmVtO1xuICB9XG48L3N0eWxlPiIsIi8vIFV0aWxpdHkgdG8gZXhwb3J0IEFkdmFuY2VkIFNsaWRlcyBwcmVzZW50YXRpb25zXG5pbXBvcnQgeyBBcHAsIFRGaWxlLCBOb3RpY2UgfSBmcm9tICdvYnNpZGlhbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNsaWRlc0V4cG9ydGVyIHtcbiAgcHJpdmF0ZSBhcHA6IEFwcDtcbiAgXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwKSB7XG4gICAgdGhpcy5hcHAgPSBhcHA7XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBFeHBvcnQgc2xpZGVzIGZyb20gYSBtYXJrZG93biBmaWxlIHVzaW5nIGVpdGhlciBBZHZhbmNlZCBTbGlkZXMgb3IgU2xpZGVzIEV4dGVuZGVkIHBsdWdpblxuICAgKi9cbiAgYXN5bmMgZXhwb3J0U2xpZGVzKGZpbGU6IFRGaWxlKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICB0cnkge1xuICAgICAgLy8gQ2hlY2sgaWYgZWl0aGVyIEFkdmFuY2VkIFNsaWRlcyBvciBTbGlkZXMgRXh0ZW5kZWQgcGx1Z2luIGlzIGF2YWlsYWJsZVxuICAgICAgLy8gQHRzLWlnbm9yZSAtIFdlJ3JlIGNoZWNraW5nIGZvciB1bmRvY3VtZW50ZWQgQVBJcyBvZiBvdGhlciBwbHVnaW5zXG4gICAgICBjb25zdCBhZHZhbmNlZFNsaWRlcyA9IHRoaXMuYXBwLnBsdWdpbnMucGx1Z2luc1snb2JzaWRpYW4tYWR2YW5jZWQtc2xpZGVzJ107XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjb25zdCBzbGlkZXNFeHRlbmRlZCA9IHRoaXMuYXBwLnBsdWdpbnMucGx1Z2luc1snc2xpZGVzLWV4dGVuZGVkJ107XG4gICAgICBcbiAgICAgIC8vIFVzZSB3aGljaGV2ZXIgcGx1Z2luIGlzIGF2YWlsYWJsZVxuICAgICAgY29uc3Qgc2xpZGVzUGx1Z2luID0gYWR2YW5jZWRTbGlkZXMgfHwgc2xpZGVzRXh0ZW5kZWQ7XG4gICAgICBcbiAgICAgIGlmICghc2xpZGVzUGx1Z2luKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTmVpdGhlciBBZHZhbmNlZCBTbGlkZXMgbm9yIFNsaWRlcyBFeHRlbmRlZCBwbHVnaW4gaXMgaW5zdGFsbGVkIGFuZCBlbmFibGVkJyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIEdldCB0aGUgY29udGVudCBvZiB0aGUgZmlsZVxuICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoZmlsZSk7XG4gICAgICBcbiAgICAgIC8vIENyZWF0ZSBleHBvcnQgcGF0aFxuICAgICAgY29uc3QgZXhwb3J0Rm9sZGVyUGF0aCA9IHRoaXMuZ2V0RXhwb3J0UGF0aChmaWxlKTtcbiAgICAgIGNvbnNvbGUubG9nKCdVc2luZyBleHBvcnQgcGF0aDonLCBleHBvcnRGb2xkZXJQYXRoKTtcbiAgICAgIFxuICAgICAgLy8gRW5zdXJlIHRoZSBleHBvcnQgZGlyZWN0b3J5IGV4aXN0c1xuICAgICAgYXdhaXQgdGhpcy5lbnN1cmVEaXJlY3RvcnlFeGlzdHMoZXhwb3J0Rm9sZGVyUGF0aCk7XG4gICAgICBcbiAgICAgIC8vIENhbGwgdGhlIHNsaWRlcyBwbHVnaW4gZXhwb3J0IG1ldGhvZFxuICAgICAgLy8gVHJ5IHRvIHVzZSB0aGUgYXBwcm9wcmlhdGUgQVBJIGJhc2VkIG9uIHdoaWNoIHBsdWdpbiBpcyBpbnN0YWxsZWRcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHBsdWdpbklkID0gYWR2YW5jZWRTbGlkZXMgPyAnQWR2YW5jZWQgU2xpZGVzJyA6ICdTbGlkZXMgRXh0ZW5kZWQnO1xuICAgICAgICBuZXcgTm90aWNlKGBFeHBvcnRpbmcgd2l0aCAke3BsdWdpbklkfS4uLmApO1xuICAgICAgICBcbiAgICAgICAgaWYgKHNsaWRlc0V4dGVuZGVkKSB7XG4gICAgICAgICAgLy8gRm9yIFNsaWRlcyBFeHRlbmRlZCwgdXNlIGl0cyBjb25maWd1cmVkIGV4cG9ydCBkaXJlY3RvcnlcbiAgICAgICAgICBhd2FpdCBzbGlkZXNFeHRlbmRlZC5yZW5kZXJlci5leHBvcnQoZmlsZS5wYXRoLCBleHBvcnRGb2xkZXJQYXRoLCAnc3RhdGljJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVHJ5IGRpZmZlcmVudCBleHBvcnQgQVBJIHBhdHRlcm5zIGZvciBBZHZhbmNlZCBTbGlkZXNcbiAgICAgICAgZWxzZSBpZiAoYWR2YW5jZWRTbGlkZXMuZXhwb3J0U2xpZGVzICYmIHR5cGVvZiBhZHZhbmNlZFNsaWRlcy5leHBvcnRTbGlkZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBhd2FpdCBhZHZhbmNlZFNsaWRlcy5leHBvcnRTbGlkZXMoZmlsZS5wYXRoLCBleHBvcnRGb2xkZXJQYXRoLCAnc3RhdGljJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYWR2YW5jZWRTbGlkZXMuc2xpZGVNYW5hZ2VyICYmIHR5cGVvZiBhZHZhbmNlZFNsaWRlcy5zbGlkZU1hbmFnZXIuZXhwb3J0U2xpZGVzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgYXdhaXQgYWR2YW5jZWRTbGlkZXMuc2xpZGVNYW5hZ2VyLmV4cG9ydFNsaWRlcyhmaWxlLnBhdGgsIGV4cG9ydEZvbGRlclBhdGgsICdzdGF0aWMnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAvLyBJZiBubyByZWNvZ25pemVkIEFQSSBwYXR0ZXJucyBhcmUgZm91bmQsIHVzZSBvdXIgZmFsbGJhY2sgbWV0aG9kXG4gICAgICAgICAgYXdhaXQgdGhpcy5tYW51YWxFeHBvcnQoZmlsZSwgY29udGVudCwgZXhwb3J0Rm9sZGVyUGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBleHBvcnRGb2xkZXJQYXRoO1xuICAgICAgfSBjYXRjaCAoZXhwb3J0RXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZXhwb3J0aW5nIHdpdGggc2xpZGVzIHBsdWdpbiBBUEk6JywgZXhwb3J0RXJyb3IpO1xuICAgICAgICAvLyBGYWxsYmFjayB0byBtYW51YWwgZXhwb3J0XG4gICAgICAgIGF3YWl0IHRoaXMubWFudWFsRXhwb3J0KGZpbGUsIGNvbnRlbnQsIGV4cG9ydEZvbGRlclBhdGgpO1xuICAgICAgICByZXR1cm4gZXhwb3J0Rm9sZGVyUGF0aDtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGV4cG9ydCBzbGlkZXM6JywgZXJyb3IpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gZXhwb3J0IHNsaWRlczogJHtlcnJvci5tZXNzYWdlfWApO1xuICAgIH1cbiAgfVxuICBcbiAgLyoqXG4gICAqIEVuc3VyZSB0aGUgZXhwb3J0IGRpcmVjdG9yeSBleGlzdHNcbiAgICovXG4gIHByaXZhdGUgYXN5bmMgZW5zdXJlRGlyZWN0b3J5RXhpc3RzKGRpclBhdGg6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRyeSB7XG4gICAgICAvLyBVc2UgdGhlIE9ic2lkaWFuIGFkYXB0ZXJcbiAgICAgIC8vIEB0cy1pZ25vcmUgLSBleGlzdHMgaXMgbm90IGluIHRoZSBwdWJsaWMgQVBJIHR5cGluZ3NcbiAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIuZXhpc3RzKGRpclBhdGgpO1xuICAgICAgaWYgKCFleGlzdHMpIHtcbiAgICAgICAgLy8gQ3JlYXRlIGFsbCBwYXJlbnQgZGlyZWN0b3JpZXMgYXMgbmVlZGVkXG4gICAgICAgIGNvbnN0IHBhdGhTZWdtZW50cyA9IGRpclBhdGguc3BsaXQoL1tcXC9cXFxcXS8pO1xuICAgICAgICBsZXQgY3VycmVudFBhdGggPSAnJztcbiAgICAgICAgXG4gICAgICAgIGZvciAoY29uc3Qgc2VnbWVudCBvZiBwYXRoU2VnbWVudHMpIHtcbiAgICAgICAgICBpZiAoIXNlZ21lbnQpIGNvbnRpbnVlO1xuICAgICAgICAgIGN1cnJlbnRQYXRoICs9IChjdXJyZW50UGF0aCA/ICcvJyA6ICcnKSArIHNlZ21lbnQ7XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZSAtIGV4aXN0cyBpcyBub3QgaW4gdGhlIHB1YmxpYyBBUEkgdHlwaW5nc1xuICAgICAgICAgIGNvbnN0IHNlZ21lbnRFeGlzdHMgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5hZGFwdGVyLmV4aXN0cyhjdXJyZW50UGF0aCk7XG4gICAgICAgICAgaWYgKCFzZWdtZW50RXhpc3RzKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlIC0gbWtkaXIgaXMgbm90IGluIHRoZSBwdWJsaWMgQVBJIHR5cGluZ3NcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIubWtkaXIoY3VycmVudFBhdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIGRpcmVjdG9yeTonLCBlcnJvcik7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBjcmVhdGUgZXhwb3J0IGRpcmVjdG9yeTogJHtlcnJvci5tZXNzYWdlfWApO1xuICAgIH1cbiAgfVxuICBcbiAgLyoqXG4gICAqIEdldCB0aGUgZXhwb3J0IHBhdGggZm9yIGEgZmlsZVxuICAgKi9cbiAgcHJpdmF0ZSBnZXRFeHBvcnRQYXRoKGZpbGU6IFRGaWxlKTogc3RyaW5nIHtcbiAgICB0cnkge1xuICAgICAgLy8gQ2hlY2sgaWYgU2xpZGVzIEV4dGVuZGVkIGlzIGF2YWlsYWJsZSBhbmQgZ2V0IGl0cyBleHBvcnQgZGlyZWN0b3J5IHNldHRpbmdcbiAgICAgIC8vIEB0cy1pZ25vcmUgLSBhY2Nlc3NpbmcgcGx1Z2luIHNldHRpbmdzXG4gICAgICBjb25zdCBzbGlkZXNFeHRlbmRlZCA9IHRoaXMuYXBwLnBsdWdpbnMucGx1Z2luc1snc2xpZGVzLWV4dGVuZGVkJ107XG4gICAgICBpZiAoc2xpZGVzRXh0ZW5kZWQ/LnNldHRpbmdzPy5leHBvcnREaXJlY3RvcnkpIHtcbiAgICAgICAgY29uc3QgZXhwb3J0RGlyID0gc2xpZGVzRXh0ZW5kZWQuc2V0dGluZ3MuZXhwb3J0RGlyZWN0b3J5LnRyaW0oKTtcbiAgICAgICAgLy8gQ3JlYXRlIGEgdW5pcXVlIGZvbGRlciBuYW1lXG4gICAgICAgIGNvbnN0IGZvbGRlck5hbWUgPSBgJHtmaWxlLmJhc2VuYW1lLnJlcGxhY2UoL1teYS16QS1aMC05XS9nLCAnLScpfS0ke0RhdGUubm93KCl9YDtcbiAgICAgICAgXG4gICAgICAgIC8vIElmIGV4cG9ydCBkaXJlY3RvcnkgaXMgYWJzb2x1dGUgKHN0YXJ0cyB3aXRoIC8pLCB1c2UgaXQgYXMgaXNcbiAgICAgICAgaWYgKGV4cG9ydERpci5zdGFydHNXaXRoKCcvJykpIHtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlIC0gZ2V0QmFzZVBhdGggaXMgbm90IGluIHRoZSBwdWJsaWMgQVBJIHR5cGluZ3NcbiAgICAgICAgICBjb25zdCBiYXNlUGF0aCA9IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIuZ2V0QmFzZVBhdGgoKTtcbiAgICAgICAgICBjb25zdCBwYXRoU2VwYXJhdG9yID0gYmFzZVBhdGguaW5jbHVkZXMoJ1xcXFwnKSA/ICdcXFxcJyA6ICcvJztcbiAgICAgICAgICByZXR1cm4gYCR7YmFzZVBhdGh9JHtleHBvcnREaXJ9JHtwYXRoU2VwYXJhdG9yfSR7Zm9sZGVyTmFtZX1gO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBPdGhlcndpc2UsIHRyZWF0IGl0IGFzIHJlbGF0aXZlIHRvIHZhdWx0IHJvb3RcbiAgICAgICAgLy8gQHRzLWlnbm9yZSAtIGdldEJhc2VQYXRoIGlzIG5vdCBpbiB0aGUgcHVibGljIEFQSSB0eXBpbmdzXG4gICAgICAgIGNvbnN0IGJhc2VQYXRoID0gdGhpcy5hcHAudmF1bHQuYWRhcHRlci5nZXRCYXNlUGF0aCgpO1xuICAgICAgICBjb25zdCBwYXRoU2VwYXJhdG9yID0gYmFzZVBhdGguaW5jbHVkZXMoJ1xcXFwnKSA/ICdcXFxcJyA6ICcvJztcbiAgICAgICAgcmV0dXJuIGAke2Jhc2VQYXRofSR7cGF0aFNlcGFyYXRvcn0ke2V4cG9ydERpcn0ke3BhdGhTZXBhcmF0b3J9JHtmb2xkZXJOYW1lfWA7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIEZhbGxiYWNrIHRvIGRlZmF1bHQgcGF0aCBpZiBTbGlkZXMgRXh0ZW5kZWQgaXMgbm90IGF2YWlsYWJsZSBvciBubyBleHBvcnQgZGlyZWN0b3J5IGlzIHNldFxuICAgICAgLy8gQHRzLWlnbm9yZSAtIGdldEJhc2VQYXRoIGlzIG5vdCBpbiB0aGUgcHVibGljIEFQSSB0eXBpbmdzXG4gICAgICBjb25zdCBiYXNlUGF0aCA9IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIuZ2V0QmFzZVBhdGgoKTtcbiAgICAgIGNvbnN0IHBhdGhTZXBhcmF0b3IgPSBiYXNlUGF0aC5pbmNsdWRlcygnXFxcXCcpID8gJ1xcXFwnIDogJy8nO1xuICAgICAgXG4gICAgICAvLyBDcmVhdGUgYSB1bmlxdWUgZm9sZGVyIG5hbWVcbiAgICAgIGNvbnN0IGZvbGRlck5hbWUgPSBgJHtmaWxlLmJhc2VuYW1lLnJlcGxhY2UoL1teYS16QS1aMC05XS9nLCAnLScpfS0ke0RhdGUubm93KCl9YDtcbiAgICAgIFxuICAgICAgY29uc3QgcGF0aFNlZ21lbnRzID0gW1xuICAgICAgICBiYXNlUGF0aCxcbiAgICAgICAgJy5vYnNpZGlhbicsXG4gICAgICAgICdwbHVnaW5zJyxcbiAgICAgICAgJ2FkdmFuY2VkLXNsaWRlcy1uZXRsaWZ5LWRlcGxveWVyJyxcbiAgICAgICAgJ2V4cG9ydHMnLFxuICAgICAgICBmb2xkZXJOYW1lXG4gICAgICBdO1xuICAgICAgXG4gICAgICByZXR1cm4gcGF0aFNlZ21lbnRzLmpvaW4ocGF0aFNlcGFyYXRvcik7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGdldHRpbmcgZXhwb3J0IHBhdGg6JywgZXJyb3IpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gZGV0ZXJtaW5lIGV4cG9ydCBwYXRoOiAke2Vycm9yLm1lc3NhZ2V9YCk7XG4gICAgfVxuICB9XG4gIFxuICAvKipcbiAgICogTWFudWFsbHkgZXhwb3J0IHNsaWRlcyB3aGVuIHRoZSBBUEkgaXMgbm90IGF2YWlsYWJsZVxuICAgKiBUaGlzIGlzIGEgbW9yZSBpbnZvbHZlZCBwcm9jZXNzIHRoYXQgdHJpZXMgdG8gbWltaWMgd2hhdCB0aGUgQWR2YW5jZWQgU2xpZGVzIHBsdWdpbiBkb2VzXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIG1hbnVhbEV4cG9ydChmaWxlOiBURmlsZSwgY29udGVudDogc3RyaW5nLCBleHBvcnRQYXRoOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAvLyBDcmVhdGUgYSBub3RpZmljYXRpb25cbiAgICBuZXcgTm90aWNlKGBFeHBvcnRpbmcgJHtmaWxlLmJhc2VuYW1lfSB3aXRoIEFkdmFuY2VkIFNsaWRlcy4uLmApO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICAvLyBDcmVhdGUgYSBiYXNpYyByZXZlYWwuanMgcHJlc2VudGF0aW9uXG4gICAgICBjb25zdCBpbmRleEh0bWwgPSB0aGlzLmdlbmVyYXRlQmFzaWNSZXZlYWxQcmVzZW50YXRpb24oZmlsZS5iYXNlbmFtZSwgY29udGVudCk7XG4gICAgICBcbiAgICAgIC8vIENyZWF0ZSB0aGUgaW5kZXguaHRtbCBmaWxlIGluIHRoZSBleHBvcnQgZGlyZWN0b3J5XG4gICAgICBjb25zdCBpbmRleFBhdGggPSBgJHtleHBvcnRQYXRofS9pbmRleC5odG1sYDtcbiAgICAgIFxuICAgICAgLy8gRmlyc3QgZW5zdXJlIHRoZSBkaXJlY3RvcnkgZXhpc3RzXG4gICAgICBhd2FpdCB0aGlzLmVuc3VyZURpcmVjdG9yeUV4aXN0cyhleHBvcnRQYXRoKTtcbiAgICAgIFxuICAgICAgLy8gQ3JlYXRlIHRoZSBmaWxlIHVzaW5nIHRoZSBhZGFwdGVyIGRpcmVjdGx5XG4gICAgICAvLyBAdHMtaWdub3JlIC0gd3JpdGVGaWxlIGlzIG5vdCBpbiB0aGUgcHVibGljIEFQSSB0eXBpbmdzXG4gICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5hZGFwdGVyLndyaXRlKGluZGV4UGF0aCwgaW5kZXhIdG1sKTtcbiAgICAgIFxuICAgICAgLy8gQWxzbyBjcmVhdGUgYSBtYW5pZmVzdCBmaWxlIHRvIGhlbHAgd2l0aCBkZXBsb3ltZW50XG4gICAgICBjb25zdCBtYW5pZmVzdENvbnRlbnQgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGV4cG9ydFRpbWU6IERhdGUubm93KCksXG4gICAgICAgIHNvdXJjZVBhdGg6IGZpbGUucGF0aCxcbiAgICAgICAgZmlsZXM6IFsnaW5kZXguaHRtbCddXG4gICAgICB9LCBudWxsLCAyKTtcbiAgICAgIFxuICAgICAgLy8gQHRzLWlnbm9yZSAtIHdyaXRlRmlsZSBpcyBub3QgaW4gdGhlIHB1YmxpYyBBUEkgdHlwaW5nc1xuICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuYWRhcHRlci53cml0ZShgJHtleHBvcnRQYXRofS9tYW5pZmVzdC5qc29uYCwgbWFuaWZlc3RDb250ZW50KTtcbiAgICAgIFxuICAgICAgbmV3IE5vdGljZShgRXhwb3J0IGNvbXBsZXRlZCEgRmlsZXMgc2F2ZWQgdG8gJHtleHBvcnRQYXRofWApO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdNYW51YWwgZXhwb3J0IGZhaWxlZDonLCBlcnJvcik7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE1hbnVhbCBleHBvcnQgZmFpbGVkOiAke2Vycm9yLm1lc3NhZ2V9YCk7XG4gICAgfVxuICB9XG4gIFxuICAvKipcbiAgICogR2VuZXJhdGUgYSBiYXNpYyByZXZlYWwuanMgcHJlc2VudGF0aW9uIEhUTUxcbiAgICovXG4gIHByaXZhdGUgZ2VuZXJhdGVCYXNpY1JldmVhbFByZXNlbnRhdGlvbih0aXRsZTogc3RyaW5nLCBtYXJrZG93bjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAvLyBDb252ZXJ0IG1hcmtkb3duIHNsaWRlcyB0byBIVE1MICh2ZXJ5IGJhc2ljIGNvbnZlcnNpb24pXG4gICAgY29uc3Qgc2xpZGVDb250ZW50ID0gbWFya2Rvd25cbiAgICAgIC5zcGxpdCgvXi0tLSQvbSkgIC8vIFNwbGl0IG9uIHNsaWRlIHNlcGFyYXRvcnNcbiAgICAgIC5tYXAoc2xpZGUgPT4gYDxzZWN0aW9uPiR7c2xpZGUudHJpbSgpfTwvc2VjdGlvbj5gKVxuICAgICAgLmpvaW4oJycpO1xuICAgIFxuICAgIHJldHVybiBgXG48IURPQ1RZUEUgaHRtbD5cbjxodG1sPlxuPGhlYWQ+XG4gIDxtZXRhIGNoYXJzZXQ9XCJ1dGYtOFwiPlxuICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMFwiPlxuICA8dGl0bGU+JHt0aXRsZX08L3RpdGxlPlxuICA8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cImh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vcmV2ZWFsLmpzQDQuMi4xL2Rpc3QvcmV2ZWFsLmNzc1wiPlxuICA8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cImh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vcmV2ZWFsLmpzQDQuMi4xL2Rpc3QvdGhlbWUvd2hpdGUuY3NzXCI+XG4gIDxzdHlsZT5cbiAgICAucmV2ZWFsIHByZSB7XG4gICAgICBib3gtc2hhZG93OiBub25lO1xuICAgIH1cbiAgICAucmV2ZWFsIGgxLCAucmV2ZWFsIGgyLCAucmV2ZWFsIGgzLCAucmV2ZWFsIGg0LCAucmV2ZWFsIGg1LCAucmV2ZWFsIGg2IHtcbiAgICAgIHRleHQtdHJhbnNmb3JtOiBub25lO1xuICAgIH1cbiAgPC9zdHlsZT5cbjwvaGVhZD5cbjxib2R5PlxuICA8ZGl2IGNsYXNzPVwicmV2ZWFsXCI+XG4gICAgPGRpdiBjbGFzcz1cInNsaWRlc1wiPlxuICAgICAgJHtzbGlkZUNvbnRlbnR9XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuICA8c2NyaXB0IHNyYz1cImh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vcmV2ZWFsLmpzQDQuMi4xL2Rpc3QvcmV2ZWFsLmpzXCI+PC9zY3JpcHQ+XG4gIDxzY3JpcHQgc3JjPVwiaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9yZXZlYWwuanNANC4yLjEvcGx1Z2luL21hcmtkb3duL21hcmtkb3duLmpzXCI+PC9zY3JpcHQ+XG4gIDxzY3JpcHQgc3JjPVwiaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9yZXZlYWwuanNANC4yLjEvcGx1Z2luL2hpZ2hsaWdodC9oaWdobGlnaHQuanNcIj48L3NjcmlwdD5cbiAgPHNjcmlwdCBzcmM9XCJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL3JldmVhbC5qc0A0LjIuMS9wbHVnaW4vbm90ZXMvbm90ZXMuanNcIj48L3NjcmlwdD5cbiAgPHNjcmlwdD5cbiAgICBSZXZlYWwuaW5pdGlhbGl6ZSh7XG4gICAgICBoYXNoOiB0cnVlLFxuICAgICAgcGx1Z2luczogWyBSZXZlYWxNYXJrZG93biwgUmV2ZWFsSGlnaGxpZ2h0LCBSZXZlYWxOb3RlcyBdXG4gICAgfSk7XG4gIDwvc2NyaXB0PlxuPC9ib2R5PlxuPC9odG1sPlxuICAgIGAudHJpbSgpO1xuICB9XG59XG4iLCI8c2NyaXB0IGxhbmc9XCJ0c1wiPlxuICBpbXBvcnQgeyBvbk1vdW50IH0gZnJvbSAnc3ZlbHRlJztcbiAgaW1wb3J0IHsgTm90aWNlIH0gZnJvbSAnb2JzaWRpYW4nO1xuICBpbXBvcnQgQXV0aEZsb3cgZnJvbSAnLi9BdXRoRmxvdy5zdmVsdGUnO1xuICBpbXBvcnQgRGVwbG95bWVudFN0YXR1cyBmcm9tICcuL0RlcGxveW1lbnRTdGF0dXMuc3ZlbHRlJztcbiAgaW1wb3J0IE5ldGxpZnlTZXJ2aWNlIGZyb20gJy4uL3NlcnZpY2VzL25ldGxpZnktc2VydmljZSc7XG4gIGltcG9ydCBTbGlkZXNFeHBvcnRlciBmcm9tICcuLi9zZXJ2aWNlcy9zbGlkZXMtZXhwb3J0ZXInO1xuICBpbXBvcnQgeyBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcbiAgXG4gIC8vIFByb3BzXG4gIGV4cG9ydCBsZXQgZmlsZTogVEZpbGU7XG4gIGV4cG9ydCBsZXQgc2V0dGluZ3M6IGFueTtcbiAgZXhwb3J0IGxldCBuZXRsaWZ5U2VydmljZTogTmV0bGlmeVNlcnZpY2U7XG4gIGV4cG9ydCBsZXQgc2xpZGVzRXhwb3J0ZXI6IFNsaWRlc0V4cG9ydGVyO1xuICBleHBvcnQgbGV0IHNhdmVTZXR0aW5nczogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgZXhwb3J0IGxldCBjbG9zZTogKCkgPT4gdm9pZDtcbiAgXG4gIC8vIENvbXBvbmVudCBzdGF0ZVxuICBsZXQgZGVwbG95bWVudE5hbWUgPSBmaWxlID8gZmlsZS5iYXNlbmFtZSA6ICcnO1xuICBsZXQgZGVwbG95bWVudFN0YXR1czogJ3ByZXBhcmluZycgfCAnZXhwb3J0aW5nJyB8ICdkZXBsb3lpbmcnIHwgJ3N1Y2Nlc3MnIHwgJ2Vycm9yJyA9ICdwcmVwYXJpbmcnO1xuICBsZXQgZGVwbG95bWVudFVybCA9ICcnO1xuICBsZXQgZXJyb3JNZXNzYWdlID0gJyc7XG4gIGxldCBwcm9ncmVzcyA9IDA7XG4gIGxldCBzaG93QXV0aCA9ICFzZXR0aW5ncy5uZXRsaWZ5VG9rZW47XG4gIGxldCBkZXBsb3ltZW50U3RhcnRUaW1lOiBudW1iZXI7XG4gIGxldCBkZXBsb3ltZW50RW5kVGltZTogbnVtYmVyO1xuICBsZXQgbG9nczogc3RyaW5nW10gPSBbXTtcbiAgXG4gIG9uTW91bnQoKCkgPT4ge1xuICAgIGlmIChzZXR0aW5ncy5uZXRsaWZ5VG9rZW4gJiYgZmlsZSkge1xuICAgICAgLy8gU3RhcnQgdGhlIGRlcGxveW1lbnQgcHJvY2Vzc1xuICAgICAgZGVwbG95KCk7XG4gICAgfVxuICAgIG5ldGxpZnlTZXJ2aWNlLmNsZWFyRGVwbG95bWVudExvZ3MoKTtcbiAgfSk7XG4gIFxuICBhc3luYyBmdW5jdGlvbiBkZXBsb3koKSB7XG4gICAgdHJ5IHtcbiAgICAgIGRlcGxveW1lbnRTdGF0dXMgPSAnZXhwb3J0aW5nJztcbiAgICAgIHByb2dyZXNzID0gMTA7XG4gICAgICBcbiAgICAgIC8vIEV4cG9ydCB0aGUgc2xpZGVzXG4gICAgICBwcm9ncmVzcyA9IDIwO1xuICAgICAgY29uc3QgZXhwb3J0UGF0aCA9IGF3YWl0IHNsaWRlc0V4cG9ydGVyLmV4cG9ydFNsaWRlcyhmaWxlKTtcbiAgICAgIFxuICAgICAgaWYgKCFleHBvcnRQYXRoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGV4cG9ydCBzbGlkZXMuIE1ha2Ugc3VyZSBBZHZhbmNlZCBTbGlkZXMgcGx1Z2luIGlzIGluc3RhbGxlZCBhbmQgYWN0aXZlLicpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBwcm9ncmVzcyA9IDQwO1xuICAgICAgZGVwbG95bWVudFN0YXR1cyA9ICdkZXBsb3lpbmcnO1xuICAgICAgXG4gICAgICAvLyBEZXBsb3kgdG8gTmV0bGlmeVxuICAgICAgY29uc3QgZGVwbG95bWVudCA9IGF3YWl0IG5ldGxpZnlTZXJ2aWNlLmRlcGxveVRvTmV0bGlmeShleHBvcnRQYXRoLCBkZXBsb3ltZW50TmFtZSk7XG4gICAgICBcbiAgICAgIC8vIEdldCBkZXBsb3ltZW50IGxvZ3NcbiAgICAgIGxvZ3MgPSBuZXRsaWZ5U2VydmljZS5nZXREZXBsb3ltZW50TG9ncygpO1xuICAgICAgXG4gICAgICBpZiAoIWRlcGxveW1lbnQgfHwgIWRlcGxveW1lbnQudXJsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRGVwbG95bWVudCBmYWlsZWQuIENoZWNrIHlvdXIgTmV0bGlmeSBzZXR0aW5ncyBhbmQgdHJ5IGFnYWluLicpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBkZXBsb3ltZW50VXJsID0gZGVwbG95bWVudC51cmw7XG4gICAgICBkZXBsb3ltZW50U3RhdHVzID0gJ3N1Y2Nlc3MnO1xuICAgICAgcHJvZ3Jlc3MgPSAxMDA7XG4gICAgICBcbiAgICAgIC8vIFVwZGF0ZSBkZXBsb3ltZW50IGhpc3RvcnlcbiAgICAgIGNvbnN0IGhpc3RvcnkgPSBzZXR0aW5ncy5kZXBsb3ltZW50SGlzdG9yeSB8fCBbXTtcbiAgICAgIGhpc3RvcnkudW5zaGlmdCh7XG4gICAgICAgIGlkOiBkZXBsb3ltZW50LmlkLFxuICAgICAgICB1cmw6IGRlcGxveW1lbnQudXJsLFxuICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICAgIG5hbWU6IGRlcGxveW1lbnROYW1lLFxuICAgICAgICBzdGF0dXM6IGRlcGxveW1lbnQuc3RhdGVcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICAvLyBLZWVwIG9ubHkgbGFzdCAxMCBkZXBsb3ltZW50c1xuICAgICAgaWYgKGhpc3RvcnkubGVuZ3RoID4gMTApIHtcbiAgICAgICAgaGlzdG9yeS5wb3AoKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgYXdhaXQgc2F2ZVNldHRpbmdzKHtcbiAgICAgICAgLi4uc2V0dGluZ3MsXG4gICAgICAgIGRlcGxveW1lbnRIaXN0b3J5OiBoaXN0b3J5XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgZGVwbG95bWVudEVuZFRpbWUgPSBEYXRlLm5vdygpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBkZXBsb3ltZW50U3RhdHVzID0gJ2Vycm9yJztcbiAgICAgIGVycm9yTWVzc2FnZSA9IGVycm9yLm1lc3NhZ2UgfHwgJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQnO1xuICAgICAgY29uc29sZS5lcnJvcignRGVwbG95bWVudCBlcnJvcjonLCBlcnJvcik7XG4gICAgICBsb2dzID0gbmV0bGlmeVNlcnZpY2UuZ2V0RGVwbG95bWVudExvZ3MoKTtcbiAgICB9XG4gIH1cbiAgXG4gIGZ1bmN0aW9uIGZvcm1hdER1cmF0aW9uKCkge1xuICAgIGlmICghZGVwbG95bWVudFN0YXJ0VGltZSkgcmV0dXJuICcwMDowMCc7XG4gICAgY29uc3QgZW5kID0gZGVwbG95bWVudEVuZFRpbWUgfHwgRGF0ZS5ub3coKTtcbiAgICBjb25zdCBkdXJhdGlvbiA9IE1hdGguZmxvb3IoKGVuZCAtIGRlcGxveW1lbnRTdGFydFRpbWUpIC8gMTAwMCk7XG4gICAgY29uc3QgbWludXRlcyA9IE1hdGguZmxvb3IoZHVyYXRpb24gLyA2MCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgIGNvbnN0IHNlY29uZHMgPSAoZHVyYXRpb24gJSA2MCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgIHJldHVybiBgJHttaW51dGVzfToke3NlY29uZHN9YDtcbiAgfVxuICBcbiAgZnVuY3Rpb24gaGFuZGxlQXV0aENvbXBsZXRlKHRva2VuOiBzdHJpbmcpIHtcbiAgICBzZXR0aW5ncy5uZXRsaWZ5VG9rZW4gPSB0b2tlbjtcbiAgICBzYXZlU2V0dGluZ3MoKTtcbiAgICBzaG93QXV0aCA9IGZhbHNlO1xuICAgIGRlcGxveSgpO1xuICB9XG48L3NjcmlwdD5cblxuPGRpdiBjbGFzcz1cImRlcGxveW1lbnQtbW9kYWxcIj5cbiAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxuICAgIDxoMj5EZXBsb3kgdG8gTmV0bGlmeTwvaDI+XG4gICAgPGJ1dHRvbiBjbGFzcz1cImNsb3NlLWJ1dHRvblwiIG9uOmNsaWNrPXtjbG9zZX0+w5c8L2J1dHRvbj5cbiAgPC9kaXY+XG4gIFxuICB7I2lmIHNob3dBdXRofVxuICAgIDxkaXYgY2xhc3M9XCJhdXRoLWNvbnRhaW5lclwiPlxuICAgICAgPHA+WW91IG5lZWQgdG8gYXV0aGVudGljYXRlIHdpdGggTmV0bGlmeSBmaXJzdDo8L3A+XG4gICAgICA8QXV0aEZsb3cgb246dG9rZW5HZW5lcmF0ZWQ9eyhldmVudCkgPT4gaGFuZGxlQXV0aENvbXBsZXRlKGV2ZW50LmRldGFpbC50b2tlbil9IC8+XG4gICAgPC9kaXY+XG4gIHs6ZWxzZX1cbiAgICA8ZGl2IGNsYXNzPVwiZGVwbG95bWVudC1jb250YWluZXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJmaWxlLWluZm9cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZpbGUtaWNvblwiPvCfk4Q8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZpbGUtZGV0YWlsc1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWxlLW5hbWVcIj57ZmlsZS5iYXNlbmFtZX08L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmlsZS1wYXRoXCI+e2ZpbGUucGF0aH08L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIFxuICAgICAgPGRpdiBjbGFzcz1cImRlcGxveW1lbnQtZm9ybVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgIDxsYWJlbCBmb3I9XCJkZXBsb3ltZW50LW5hbWVcIj5EZXBsb3ltZW50IE5hbWU6PC9sYWJlbD5cbiAgICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgICB0eXBlPVwidGV4dFwiIFxuICAgICAgICAgICAgaWQ9XCJkZXBsb3ltZW50LW5hbWVcIiBcbiAgICAgICAgICAgIGJpbmQ6dmFsdWU9e2RlcGxveW1lbnROYW1lfSBcbiAgICAgICAgICAgIGRpc2FibGVkPXtkZXBsb3ltZW50U3RhdHVzICE9PSAncHJlcGFyaW5nJ31cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgXG4gICAgICA8RGVwbG95bWVudFN0YXR1cyBcbiAgICAgICAgc3RhdHVzPXtkZXBsb3ltZW50U3RhdHVzfSBcbiAgICAgICAgcHJvZ3Jlc3M9e3Byb2dyZXNzfSBcbiAgICAgICAgZXJyb3I9e2Vycm9yTWVzc2FnZX0gXG4gICAgICAgIHVybD17ZGVwbG95bWVudFVybH0gXG4gICAgICAgIHN0YXJ0VGltZT17ZGVwbG95bWVudFN0YXJ0VGltZX1cbiAgICAgICAgZW5kVGltZT17ZGVwbG95bWVudEVuZFRpbWV9XG4gICAgICAgIGZvcm1hdER1cmF0aW9uPXtmb3JtYXREdXJhdGlvbn1cbiAgICAgIC8+XG4gICAgICBcbiAgICAgIHsjaWYgZGVwbG95bWVudFN0YXR1cyA9PT0gJ2Vycm9yJ31cbiAgICAgICAgPGRpdiBjbGFzcz1cImVycm9yLXNlY3Rpb25cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXJyb3ItbWVzc2FnZVwiPkVycm9yOiB7ZXJyb3JNZXNzYWdlfTwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0cm91Ymxlc2hvb3RpbmdcIj5cbiAgICAgICAgICAgIDxoND5Ucm91Ymxlc2hvb3RpbmcgdGlwczo8L2g0PlxuICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICA8bGk+Q2hlY2sgeW91ciBOZXRsaWZ5IGF1dGhlbnRpY2F0aW9uIHRva2VuPC9saT5cbiAgICAgICAgICAgICAgPGxpPkVuc3VyZSBBZHZhbmNlZCBTbGlkZXMgcGx1Z2luIGlzIGluc3RhbGxlZCBhbmQgYWN0aXZlPC9saT5cbiAgICAgICAgICAgICAgPGxpPkNoZWNrIHlvdXIgaW50ZXJuZXQgY29ubmVjdGlvbjwvbGk+XG4gICAgICAgICAgICAgIDxsaT5UcnkgYWdhaW4gaW4gYSBmZXcgbWludXRlczwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJjb3B5LWxvZ3MtYnV0dG9uXCIgb246Y2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxvZ1RleHQgPSBsb2dzLmpvaW4oJ1xcbicpO1xuICAgICAgICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQobG9nVGV4dCk7XG4gICAgICAgICAgICBuZXcgTm90aWNlKCdMb2dzIGNvcGllZCB0byBjbGlwYm9hcmQnKTtcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIENvcHkgTG9ncyB0byBDbGlwYm9hcmRcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICB7L2lmfVxuICAgICAgXG4gICAgICB7I2lmIGxvZ3MubGVuZ3RoID4gMH1cbiAgICAgICAgPGRpdiBjbGFzcz1cImxvZ3Mtc2VjdGlvblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJsb2dzLWhlYWRlclwiPlxuICAgICAgICAgICAgPGg0PkRlcGxveW1lbnQgTG9nczo8L2g0PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNvcHktbG9ncy1idXR0b25cIiBvbjpjbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBsb2dUZXh0ID0gbG9ncy5qb2luKCdcXG4nKTtcbiAgICAgICAgICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQobG9nVGV4dCk7XG4gICAgICAgICAgICAgIG5ldyBOb3RpY2UoJ0xvZ3MgY29waWVkIHRvIGNsaXBib2FyZCcpO1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIENvcHkgTG9nc1xuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPHByZSBjbGFzcz1cImxvZ3NcIj57bG9ncy5qb2luKCdcXG4nKX08L3ByZT5cbiAgICAgICAgPC9kaXY+XG4gICAgICB7L2lmfVxuICAgICAgXG4gICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLWNvbnRhaW5lclwiPlxuICAgICAgICB7I2lmIGRlcGxveW1lbnRTdGF0dXMgPT09ICdzdWNjZXNzJ31cbiAgICAgICAgICA8YSBcbiAgICAgICAgICAgIGhyZWY9e2RlcGxveW1lbnRVcmx9IFxuICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCIgXG4gICAgICAgICAgICBjbGFzcz1cInZpZXctYnV0dG9uXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICBWaWV3IERlcGxveW1lbnRcbiAgICAgICAgICA8L2E+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNsb3NlLWJ1dHRvbi10ZXh0XCIgb246Y2xpY2s9e2Nsb3NlfT5DbG9zZTwvYnV0dG9uPlxuICAgICAgICB7OmVsc2UgaWYgZGVwbG95bWVudFN0YXR1cyA9PT0gJ2Vycm9yJ31cbiAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgY2xhc3M9XCJyZXRyeS1idXR0b25cIiBcbiAgICAgICAgICAgIG9uOmNsaWNrPXtkZXBsb3l9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgVHJ5IEFnYWluXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNsb3NlLWJ1dHRvbi10ZXh0XCIgb246Y2xpY2s9e2Nsb3NlfT5DYW5jZWw8L2J1dHRvbj5cbiAgICAgICAgezplbHNlfVxuICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJjYW5jZWwtYnV0dG9uXCIgb246Y2xpY2s9e2Nsb3NlfT5DYW5jZWw8L2J1dHRvbj5cbiAgICAgICAgey9pZn1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICB7L2lmfVxuPC9kaXY+XG5cbjxzdHlsZT5cbiAgLmRlcGxveW1lbnQtbW9kYWwge1xuICAgIHBhZGRpbmc6IDEuNXJlbTtcbiAgICBtYXgtd2lkdGg6IDYwMHB4O1xuICAgIG1pbi13aWR0aDogNDAwcHg7XG4gIH1cbiAgXG4gIC5tb2RhbC1oZWFkZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgbWFyZ2luLWJvdHRvbTogMS41cmVtO1xuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCB2YXIoLS1iYWNrZ3JvdW5kLW1vZGlmaWVyLWJvcmRlcik7XG4gICAgcGFkZGluZy1ib3R0b206IDAuNXJlbTtcbiAgfVxuICBcbiAgLm1vZGFsLWhlYWRlciBoMiB7XG4gICAgbWFyZ2luOiAwO1xuICB9XG4gIFxuICAuY2xvc2UtYnV0dG9uIHtcbiAgICBiYWNrZ3JvdW5kOiBub25lO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBmb250LXNpemU6IDEuNXJlbTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xuICAgIHBhZGRpbmc6IDA7XG4gIH1cbiAgXG4gIC5maWxlLWluZm8ge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iYWNrZ3JvdW5kLXNlY29uZGFyeSk7XG4gICAgcGFkZGluZzogMXJlbTtcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbiAgfVxuICBcbiAgLmZpbGUtaWNvbiB7XG4gICAgZm9udC1zaXplOiAycmVtO1xuICAgIG1hcmdpbi1yaWdodDogMXJlbTtcbiAgfVxuICBcbiAgLmZpbGUtZGV0YWlscyB7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgfVxuICBcbiAgLmZpbGUtbmFtZSB7XG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgbWFyZ2luLWJvdHRvbTogMC4yNXJlbTtcbiAgfVxuICBcbiAgLmZpbGUtcGF0aCB7XG4gICAgZm9udC1zaXplOiAwLjhyZW07XG4gICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgfVxuICBcbiAgLmRlcGxveW1lbnQtZm9ybSB7XG4gICAgbWFyZ2luLWJvdHRvbTogMS41cmVtO1xuICB9XG4gIFxuICAuZm9ybS1ncm91cCB7XG4gICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbiAgfVxuICBcbiAgbGFiZWwge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIG1hcmdpbi1ib3R0b206IDAuNXJlbTtcbiAgfVxuICBcbiAgaW5wdXRbdHlwZT1cInRleHRcIl0ge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIHBhZGRpbmc6IDAuNXJlbTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1iYWNrZ3JvdW5kLW1vZGlmaWVyLWJvcmRlcik7XG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWJhY2tncm91bmQtcHJpbWFyeSk7XG4gIH1cbiAgXG4gIC5idXR0b24tY29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGdhcDogMXJlbTtcbiAgICBtYXJnaW4tdG9wOiAxLjVyZW07XG4gIH1cbiAgXG4gIC52aWV3LWJ1dHRvbiB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0taW50ZXJhY3RpdmUtYWNjZW50KTtcbiAgICBjb2xvcjogdmFyKC0tdGV4dC1vbi1hY2NlbnQpO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgcGFkZGluZzogMC41cmVtIDFyZW07XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB9XG4gIFxuICAucmV0cnktYnV0dG9uIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1pbnRlcmFjdGl2ZS1hY2NlbnQpO1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LW9uLWFjY2VudCk7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICBwYWRkaW5nOiAwLjVyZW0gMXJlbTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIH1cbiAgXG4gIC5jYW5jZWwtYnV0dG9uLCAuY2xvc2UtYnV0dG9uLXRleHQge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWJhY2tncm91bmQtbW9kaWZpZXItYm9yZGVyKTtcbiAgICBjb2xvcjogdmFyKC0tdGV4dC1ub3JtYWwpO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgcGFkZGluZzogMC41cmVtIDFyZW07XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG4gIFxuICAuYXV0aC1jb250YWluZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICB9XG4gIFxuICAubG9ncy1zZWN0aW9uIHtcbiAgICBtYXJnaW4tdG9wOiAxcmVtO1xuICAgIHBhZGRpbmc6IDFyZW07XG4gICAgYmFja2dyb3VuZDogdmFyKC0tYmFja2dyb3VuZC1zZWNvbmRhcnkpO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgfVxuICBcbiAgLmxvZ3MtaGVhZGVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIG1hcmdpbi1ib3R0b206IDAuNXJlbTtcbiAgfVxuICBcbiAgLmNvcHktbG9ncy1idXR0b24ge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWJhY2tncm91bmQtbW9kaWZpZXItYm9yZGVyKTtcbiAgICBjb2xvcjogdmFyKC0tdGV4dC1ub3JtYWwpO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgcGFkZGluZzogMC4yNXJlbSAwLjVyZW07XG4gICAgZm9udC1zaXplOiAwLjhyZW07XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG4gIFxuICAuY29weS1sb2dzLWJ1dHRvbjpob3ZlciB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tYmFja2dyb3VuZC1tb2RpZmllci1ib3JkZXItaG92ZXIpO1xuICB9XG4gIFxuICAubG9ncyB7XG4gICAgbWF4LWhlaWdodDogMjAwcHg7XG4gICAgb3ZlcmZsb3cteTogYXV0bztcbiAgICBmb250LWZhbWlseTogbW9ub3NwYWNlO1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XG4gICAgd29yZC13cmFwOiBicmVhay13b3JkO1xuICB9XG48L3N0eWxlPiIsImltcG9ydCB7IEFwcCwgUGx1Z2luLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCBOb3RpY2UsIGFkZEljb24gfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBTdmVsdGVDb21wb25lbnQgfSBmcm9tICdzdmVsdGUnO1xuaW1wb3J0IFNldHRpbmdzIGZyb20gJy4vY29tcG9uZW50cy9TZXR0aW5ncy5zdmVsdGUnO1xuaW1wb3J0IERlcGxveW1lbnRNb2RhbCBmcm9tICcuL2NvbXBvbmVudHMvRGVwbG95bWVudE1vZGFsLnN2ZWx0ZSc7XG5pbXBvcnQgTmV0bGlmeVNlcnZpY2UgZnJvbSAnLi9zZXJ2aWNlcy9uZXRsaWZ5LXNlcnZpY2UnO1xuaW1wb3J0IFNsaWRlc0V4cG9ydGVyIGZyb20gJy4vc2VydmljZXMvc2xpZGVzLWV4cG9ydGVyJztcblxuLy8gRGVmaW5lIHBsdWdpbiBzZXR0aW5ncyBpbnRlcmZhY2VcbmludGVyZmFjZSBTbGlkZXNOZXRsaWZ5RGVwbG95ZXJTZXR0aW5ncyB7XG5cdG5ldGxpZnlUb2tlbjogc3RyaW5nO1xuXHRzaXRlSWQ6IHN0cmluZztcblx0c2l0ZU5hbWU6IHN0cmluZztcblx0dXNlQ3VzdG9tRG9tYWluOiBib29sZWFuO1xuXHRjdXN0b21Eb21haW46IHN0cmluZztcblx0ZGVwbG95bWVudFRoZW1lOiBzdHJpbmc7XG5cdGRlcGxveW1lbnRIaXN0b3J5OiBBcnJheTx7XG5cdFx0aWQ6IHN0cmluZztcblx0XHR1cmw6IHN0cmluZztcblx0XHR0aW1lc3RhbXA6IG51bWJlcjtcblx0XHRuYW1lOiBzdHJpbmc7XG5cdFx0c3RhdHVzOiBzdHJpbmc7XG5cdH0+O1xuXHRoYXNDb21wbGV0ZWRTZXR1cDogYm9vbGVhbjtcbn1cblxuLy8gRGVmYXVsdCBzZXR0aW5nc1xuY29uc3QgREVGQVVMVF9TRVRUSU5HUzogU2xpZGVzTmV0bGlmeURlcGxveWVyU2V0dGluZ3MgPSB7XG5cdG5ldGxpZnlUb2tlbjogJycsXG5cdHNpdGVJZDogJycsXG5cdHNpdGVOYW1lOiAnJyxcblx0dXNlQ3VzdG9tRG9tYWluOiBmYWxzZSxcblx0Y3VzdG9tRG9tYWluOiAnJyxcblx0ZGVwbG95bWVudFRoZW1lOiAnZGVmYXVsdCcsXG5cdGRlcGxveW1lbnRIaXN0b3J5OiBbXSxcblx0aGFzQ29tcGxldGVkU2V0dXA6IGZhbHNlXG59O1xuXG4vLyBDdXN0b20gaWNvbiBmb3IgdGhlIHJpYmJvblxuY29uc3QgTkVUTElGWV9JQ09OID0gYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj5cblx0PHBhdGggZD1cIk0xMiAyTDIgMTJoM3Y4aDE0di04aDNMMTIgMnpcIi8+XG5cdDxwYXRoIGQ9XCJNMTIgNmwtNCA0aDhsLTQtNHpcIi8+XG48L3N2Zz5gO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTbGlkZXNOZXRsaWZ5RGVwbG95ZXIgZXh0ZW5kcyBQbHVnaW4ge1xuXHRzZXR0aW5nczogU2xpZGVzTmV0bGlmeURlcGxveWVyU2V0dGluZ3M7XG5cdHByaXZhdGUgc2V0dGluZ3NDb21wb25lbnQ6IFN2ZWx0ZUNvbXBvbmVudDtcblx0cHVibGljIG5ldGxpZnlTZXJ2aWNlOiBOZXRsaWZ5U2VydmljZTtcblx0cHVibGljIHNsaWRlc0V4cG9ydGVyOiBTbGlkZXNFeHBvcnRlcjtcblxuXHRhc3luYyBvbmxvYWQoKSB7XG5cdFx0YXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcblx0XHRcblx0XHQvLyBBZGQgY3VzdG9tIGljb24gZm9yIHRoZSByaWJib25cblx0XHRhZGRJY29uKCduZXRsaWZ5LWRlcGxveScsIE5FVExJRllfSUNPTik7XG5cdFx0XG5cdFx0Ly8gQWRkIHJpYmJvbiBpY29uIGZvciBxdWljayBkZXBsb3ltZW50XG5cdFx0dGhpcy5hZGRSaWJib25JY29uKCduZXRsaWZ5LWRlcGxveScsICdEZXBsb3kgcHJlc2VudGF0aW9uIHRvIE5ldGxpZnknLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRpZiAoIXRoaXMuc2V0dGluZ3MuaGFzQ29tcGxldGVkU2V0dXApIHtcblx0XHRcdFx0bmV3IE5vdGljZSgnUGxlYXNlIGNvbXBsZXRlIHRoZSBzZXR1cCBpbiB0aGUgcGx1Z2luIHNldHRpbmdzIGZpcnN0LicpO1xuXHRcdFx0XHR0aGlzLm9wZW5TZXR0aW5ncygpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHRoaXMub3BlbkRlcGxveW1lbnRNb2RhbCgpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gQWRkIHBsdWdpbiBzZXR0aW5ncyB0YWJcblx0XHR0aGlzLmFkZFNldHRpbmdUYWIobmV3IFNsaWRlc05ldGxpZnlEZXBsb3llclNldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpKTtcblxuXHRcdC8vIEluaXRpYWxpemUgc2VydmljZXNcblx0XHR0aGlzLm5ldGxpZnlTZXJ2aWNlID0gbmV3IE5ldGxpZnlTZXJ2aWNlKFxuXHRcdFx0dGhpcy5zZXR0aW5ncyxcblx0XHRcdHRoaXMuYXBwLFxuXHRcdFx0YXN5bmMgKG5ld1NldHRpbmdzKSA9PiB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdTYXZpbmcgbmV3IHNldHRpbmdzOicsIG5ld1NldHRpbmdzKTtcblx0XHRcdFx0dGhpcy5zZXR0aW5ncyA9IHsgLi4udGhpcy5zZXR0aW5ncywgLi4ubmV3U2V0dGluZ3MgfTtcblx0XHRcdFx0YXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcblx0XHRcdH1cblx0XHQpO1xuXHRcdHRoaXMuc2xpZGVzRXhwb3J0ZXIgPSBuZXcgU2xpZGVzRXhwb3J0ZXIodGhpcy5hcHApO1xuXG5cdFx0Ly8gUmVnaXN0ZXIgY29tbWFuZHNcblx0XHR0aGlzLmFkZENvbW1hbmQoe1xuXHRcdFx0aWQ6ICdkZXBsb3ktY3VycmVudC1wcmVzZW50YXRpb24nLFxuXHRcdFx0bmFtZTogJ0RlcGxveSBjdXJyZW50IHByZXNlbnRhdGlvbiB0byBOZXRsaWZ5Jyxcblx0XHRcdGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZzogYm9vbGVhbikgPT4ge1xuXHRcdFx0XHQvLyBDaGVjayBpZiB3ZSBoYXZlIGFuIGFjdGl2ZSBtYXJrZG93biBmaWxlXG5cdFx0XHRcdGNvbnN0IGFjdGl2ZUZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuXHRcdFx0XHRpZiAoIWFjdGl2ZUZpbGUgfHwgYWN0aXZlRmlsZS5leHRlbnNpb24gIT09ICdtZCcpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdC8vIElmIHdlJ3JlIGp1c3QgY2hlY2tpbmcsIHJldHVybiB0cnVlIGlmIHdlIGhhdmUgYSBtYXJrZG93biBmaWxlXG5cdFx0XHRcdGlmIChjaGVja2luZykge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBJZiB3ZSdyZSBub3QgY2hlY2tpbmcsIG9wZW4gdGhlIGRlcGxveW1lbnQgbW9kYWxcblx0XHRcdFx0dGhpcy5vcGVuRGVwbG95bWVudE1vZGFsKCk7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Y29uc29sZS5sb2coJ1NsaWRlcyBOZXRsaWZ5IERlcGxveWVyIHBsdWdpbiBsb2FkZWQnKTtcblx0fVxuXG5cdG9udW5sb2FkKCkge1xuXHRcdC8vIENsZWFudXAgU3ZlbHRlIGNvbXBvbmVudHNcblx0XHRpZiAodGhpcy5zZXR0aW5nc0NvbXBvbmVudCkge1xuXHRcdFx0dGhpcy5zZXR0aW5nc0NvbXBvbmVudC4kZGVzdHJveSgpO1xuXHRcdH1cblx0XHRcblx0XHRjb25zb2xlLmxvZygnU2xpZGVzIE5ldGxpZnkgRGVwbG95ZXIgcGx1Z2luIHVubG9hZGVkJyk7XG5cdH1cblxuXHRhc3luYyBsb2FkU2V0dGluZ3MoKSB7XG5cdFx0dGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XG5cdFx0Y29uc29sZS5sb2coJ0xvYWRlZCBzZXR0aW5nczonLCB0aGlzLnNldHRpbmdzKTtcblx0fVxuXG5cdGFzeW5jIHNhdmVTZXR0aW5ncygpIHtcblx0XHRhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuXHRcdGNvbnNvbGUubG9nKCdTYXZlZCBzZXR0aW5nczonLCB0aGlzLnNldHRpbmdzKTtcblx0XHRcblx0XHQvLyBSZWNyZWF0ZSB0aGUgTmV0bGlmeSBzZXJ2aWNlIHdpdGggdXBkYXRlZCBzZXR0aW5nc1xuXHRcdHRoaXMubmV0bGlmeVNlcnZpY2UgPSBuZXcgTmV0bGlmeVNlcnZpY2UoXG5cdFx0XHR0aGlzLnNldHRpbmdzLFxuXHRcdFx0dGhpcy5hcHAsXG5cdFx0XHRhc3luYyAobmV3U2V0dGluZ3MpID0+IHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1NhdmluZyBuZXcgc2V0dGluZ3M6JywgbmV3U2V0dGluZ3MpO1xuXHRcdFx0XHR0aGlzLnNldHRpbmdzID0geyAuLi50aGlzLnNldHRpbmdzLCAuLi5uZXdTZXR0aW5ncyB9O1xuXHRcdFx0XHRhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuXHRcdFx0fVxuXHRcdCk7XG5cdH1cblx0XG5cdG9wZW5TZXR0aW5ncygpIHtcblx0XHR0aGlzLmFwcC5zZXR0aW5nLm9wZW4oKTtcblx0XHR0aGlzLmFwcC5zZXR0aW5nLm9wZW5UYWIoJ2FkdmFuY2VkLXNsaWRlcy1uZXRsaWZ5LWRlcGxveWVyJyk7XG5cdH1cblx0XG5cdG9wZW5EZXBsb3ltZW50TW9kYWwoKSB7XG5cdFx0Ly8gR2V0IHRoZSBhY3RpdmUgZmlsZSAtIHRoaXMgd2lsbCBiZSBvdXIgcHJlc2VudGF0aW9uXG5cdFx0Y29uc3QgYWN0aXZlRmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG5cdFx0aWYgKCFhY3RpdmVGaWxlIHx8IGFjdGl2ZUZpbGUuZXh0ZW5zaW9uICE9PSAnbWQnKSB7XG5cdFx0XHRuZXcgTm90aWNlKCdQbGVhc2Ugb3BlbiBhIG1hcmtkb3duIGZpbGUgZmlyc3QuJyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdFxuXHRcdC8vIENsZWFyIHByZXZpb3VzIGRlcGxveW1lbnQgbG9nc1xuXHRcdHRoaXMubmV0bGlmeVNlcnZpY2UuY2xlYXJEZXBsb3ltZW50TG9ncygpO1xuXHRcdFxuXHRcdC8vIENyZWF0ZSBhbmQgb3BlbiB0aGUgZGVwbG95bWVudCBtb2RhbFxuXHRcdGNvbnN0IG1vZGFsID0gbmV3IEN1c3RvbU1vZGFsKHRoaXMuYXBwLCB0aGlzKTtcblx0XHRtb2RhbC5vcGVuKCk7XG5cdH1cblxuXHQvLyBVc2VkIGJ5IHRoZSBzZXR0aW5ncyB0YWIgdG8gcmVuZGVyIHRoZSBTdmVsdGUgY29tcG9uZW50XG5cdHJlbmRlclNldHRpbmdzVUkoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50KSB7XG5cdFx0Ly8gRGVzdHJveSBleGlzdGluZyBjb21wb25lbnQgaWYgaXQgZXhpc3RzXG5cdFx0aWYgKHRoaXMuc2V0dGluZ3NDb21wb25lbnQpIHtcblx0XHRcdHRoaXMuc2V0dGluZ3NDb21wb25lbnQuJGRlc3Ryb3koKTtcblx0XHR9XG5cdFx0XG5cdFx0Ly8gQ3JlYXRlIG5ldyBjb21wb25lbnRcblx0XHR0aGlzLnNldHRpbmdzQ29tcG9uZW50ID0gbmV3IFNldHRpbmdzKHtcblx0XHRcdHRhcmdldDogY29udGFpbmVyRWwsXG5cdFx0XHRwcm9wczoge1xuXHRcdFx0XHRzZXR0aW5nczogdGhpcy5zZXR0aW5ncyxcblx0XHRcdFx0c2F2ZVNldHRpbmdzOiB0aGlzLnNhdmVTZXR0aW5ncy5iaW5kKHRoaXMpLFxuXHRcdFx0XHRuZXRsaWZ5U2VydmljZTogdGhpcy5uZXRsaWZ5U2VydmljZVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59XG5cbi8vIFNldHRpbmdzIHRhYiBjbGFzc1xuY2xhc3MgU2xpZGVzTmV0bGlmeURlcGxveWVyU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuXHRwbHVnaW46IFNsaWRlc05ldGxpZnlEZXBsb3llcjtcblx0cHVibGljIGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudDtcblxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBTbGlkZXNOZXRsaWZ5RGVwbG95ZXIpIHtcblx0XHRzdXBlcihhcHAsIHBsdWdpbik7XG5cdFx0dGhpcy5wbHVnaW4gPSBwbHVnaW47XG5cdH1cblxuXHRkaXNwbGF5KCk6IHZvaWQge1xuXHRcdGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG5cdFx0dGhpcy5jb250YWluZXJFbCA9IGNvbnRhaW5lckVsO1xuXHRcdFxuXHRcdGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cdFx0XG5cdFx0Ly8gVXNlIFN2ZWx0ZSBjb21wb25lbnQgZm9yIHNldHRpbmdzXG5cdFx0dGhpcy5wbHVnaW4ucmVuZGVyU2V0dGluZ3NVSShjb250YWluZXJFbCk7XG5cdH1cbn1cblxuLy8gQ3VzdG9tIG1vZGFsIGZvciBkZXBsb3ltZW50XG5jbGFzcyBDdXN0b21Nb2RhbCBleHRlbmRzIE1vZGFsIHtcblx0cGx1Z2luOiBTbGlkZXNOZXRsaWZ5RGVwbG95ZXI7XG5cdHByaXZhdGUgZGVwbG95bWVudENvbXBvbmVudDogU3ZlbHRlQ29tcG9uZW50O1xuXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IFNsaWRlc05ldGxpZnlEZXBsb3llcikge1xuXHRcdHN1cGVyKGFwcCk7XG5cdFx0dGhpcy5wbHVnaW4gPSBwbHVnaW47XG5cdH1cblxuXHRvbk9wZW4oKSB7XG5cdFx0Y29uc3QgeyBjb250ZW50RWwgfSA9IHRoaXM7XG5cdFx0XG5cdFx0Ly8gR2V0IHRoZSBhY3RpdmUgZmlsZVxuXHRcdGNvbnN0IGFjdGl2ZUZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuXHRcdFxuXHRcdC8vIFJlbmRlciB0aGUgU3ZlbHRlIGNvbXBvbmVudFxuXHRcdHRoaXMuZGVwbG95bWVudENvbXBvbmVudCA9IG5ldyBEZXBsb3ltZW50TW9kYWwoe1xuXHRcdFx0dGFyZ2V0OiBjb250ZW50RWwsXG5cdFx0XHRwcm9wczoge1xuXHRcdFx0XHRmaWxlOiBhY3RpdmVGaWxlLFxuXHRcdFx0XHRzZXR0aW5nczogdGhpcy5wbHVnaW4uc2V0dGluZ3MsXG5cdFx0XHRcdG5ldGxpZnlTZXJ2aWNlOiB0aGlzLnBsdWdpbi5uZXRsaWZ5U2VydmljZSxcblx0XHRcdFx0c2xpZGVzRXhwb3J0ZXI6IHRoaXMucGx1Z2luLnNsaWRlc0V4cG9ydGVyLFxuXHRcdFx0XHRzYXZlU2V0dGluZ3M6IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncy5iaW5kKHRoaXMucGx1Z2luKSxcblx0XHRcdFx0Y2xvc2U6ICgpID0+IHRoaXMuY2xvc2UoKVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0b25DbG9zZSgpIHtcblx0XHQvLyBDbGVhbnVwIFN2ZWx0ZSBjb21wb25lbnQgd2hlbiB0aGUgbW9kYWwgaXMgY2xvc2VkXG5cdFx0aWYgKHRoaXMuZGVwbG95bWVudENvbXBvbmVudCkge1xuXHRcdFx0dGhpcy5kZXBsb3ltZW50Q29tcG9uZW50LiRkZXN0cm95KCk7XG5cdFx0fVxuXHR9XG59XG5cbi8vIEFkZCBNb2RhbCBjbGFzcyBpbXBvcnQgYXQgdGhlIHRvcFxuaW1wb3J0IHsgTW9kYWwgfSBmcm9tICdvYnNpZGlhbic7Il0sIm5hbWVzIjpbImVsZW1lbnQiLCJ0ZXh0IiwiZGV0YWNoIiwiaW5zdGFuY2UiLCJjcmVhdGVfZnJhZ21lbnQiLCJjdHgiLCJjcmVhdGVfaWZfYmxvY2tfMiIsImNyZWF0ZV9pZl9ibG9jayIsImNyZWF0ZV9pZl9ibG9ja18xIiwiY3JlYXRlX2lmX2Jsb2NrXzMiLCJtb2R1bGUiLCJlIiwicmVxdWlyZSIsInQiLCJyIiwiYyIsIm4iLCJpIiwicyIsImEiLCJvIiwiaCIsImdsb2JhbCIsInUiLCJsIiwiZiIsImQiLCJwIiwibSIsInJlcXVlc3RVcmwiLCJOb3RpY2UiLCJjcmVhdGVfaWZfYmxvY2tfNSIsImNyZWF0ZV9pZl9ibG9ja180IiwiZm9sZGVyTmFtZSIsImJhc2VQYXRoIiwicGF0aFNlcGFyYXRvciIsIlBsdWdpbiIsImFkZEljb24iLCJQbHVnaW5TZXR0aW5nVGFiIiwiTW9kYWwiXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBUyxPQUFPO0FBQUc7QUFrQm5CLFNBQVMsSUFBSSxJQUFJO0FBQ2IsU0FBTyxHQUFFO0FBQ2I7QUFDQSxTQUFTLGVBQWU7QUFDcEIsU0FBTyx1QkFBTyxPQUFPLElBQUk7QUFDN0I7QUFDQSxTQUFTLFFBQVEsS0FBSztBQUNsQixNQUFJLFFBQVEsR0FBRztBQUNuQjtBQUNBLFNBQVMsWUFBWSxPQUFPO0FBQ3hCLFNBQU8sT0FBTyxVQUFVO0FBQzVCO0FBQ0EsU0FBUyxlQUFlLEdBQUcsR0FBRztBQUMxQixTQUFPLEtBQUssSUFBSSxLQUFLLElBQUksTUFBTSxNQUFPLEtBQUssT0FBTyxNQUFNLFlBQWEsT0FBTyxNQUFNO0FBQ3RGO0FBWUEsU0FBUyxTQUFTLEtBQUs7QUFDbkIsU0FBTyxPQUFPLEtBQUssR0FBRyxFQUFFLFdBQVc7QUFDdkM7QUFrVEEsU0FBUyxPQUFPLFFBQVEsTUFBTTtBQUMx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QUFFO0FBQUMsZUFBTyxFQUFFQSxJQUFFLEVBQUUsWUFBWUEsR0FBRSxNQUFNLENBQUM7QUFBQSxNQUFDLEVBQUMsR0FBRSxFQUFFLFFBQU0sRUFBQyxRQUFPLEdBQUUsT0FBTSxHQUFFLGFBQVksU0FBU0EsSUFBRTtBQUFDLGVBQU8sSUFBSSxXQUFXQSxFQUFDLEVBQUU7QUFBQSxNQUFNLEdBQUUsWUFBVyxTQUFTQSxJQUFFO0FBQUMsZUFBTyxJQUFJLFdBQVdBLEVBQUM7QUFBQSxNQUFDLEdBQUUsWUFBVyxTQUFTQSxJQUFFO0FBQUMsZUFBTyxFQUFFLGNBQWNBLEVBQUM7QUFBQSxNQUFDLEVBQUMsR0FBRSxFQUFFLGNBQVksRUFBQyxRQUFPLFNBQVNBLElBQUU7QUFBQyxlQUFPLEVBQUUsSUFBSSxXQUFXQSxFQUFDLENBQUM7QUFBQSxNQUFDLEdBQUUsT0FBTSxTQUFTQSxJQUFFO0FBQUMsZUFBTyxFQUFFLElBQUksV0FBV0EsRUFBQyxHQUFFLElBQUksTUFBTUEsR0FBRSxVQUFVLENBQUM7QUFBQSxNQUFDLEdBQUUsYUFBWSxHQUFFLFlBQVcsU0FBU0EsSUFBRTtBQUFDLGVBQU8sSUFBSSxXQUFXQSxFQUFDO0FBQUEsTUFBQyxHQUFFLFlBQVcsU0FBU0EsSUFBRTtBQUFDLGVBQU8sRUFBRSxjQUFjLElBQUksV0FBV0EsRUFBQyxDQUFDO0FBQUEsTUFBQyxFQUFDLEdBQUUsRUFBRSxhQUFXLEVBQUMsUUFBTyxHQUFFLE9BQU0sU0FBU0EsSUFBRTtBQUFDLGVBQU8sRUFBRUEsSUFBRSxJQUFJLE1BQU1BLEdBQUUsTUFBTSxDQUFDO0FBQUEsTUFBQyxHQUFFLGFBQVksU0FBU0EsSUFBRTtBQUFDLGVBQU9BLEdBQUU7QUFBQSxNQUFNLEdBQUUsWUFBVyxHQUFFLFlBQVcsU0FBU0EsSUFBRTtBQUFDLGVBQU8sRUFBRSxjQUFjQSxFQUFDO0FBQUEsTUFBQyxFQUFDLEdBQUUsRUFBRSxhQUFXLEVBQUMsUUFBTyxHQUFFLE9BQU0sU0FBU0EsSUFBRTtBQUFDLGVBQU8sRUFBRUEsSUFBRSxJQUFJLE1BQU1B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QUFJQyxLQUFFLEtBQUcsTUFBSUEsS0FBRSxLQUFHLEdBQUUsSUFBRUEsTUFBR0osS0FBRTtBQUFHLGNBQUFHLEtBQUVBLE1BQUcsSUFBRSxLQUFHTixHQUFFRyxJQUFHLEdBQUVJO0FBQUksZ0JBQUVBLEtBQUUsRUFBRUYsSUFBRyxJQUFFLFFBQU1DLEtBQUUsUUFBTSxFQUFFRCxJQUFHLElBQUVDLE1BQUdBLE1BQUcsT0FBTSxFQUFFRCxJQUFHLElBQUUsUUFBTUMsTUFBRyxLQUFHLE1BQUssRUFBRUQsSUFBRyxJQUFFLFFBQU0sT0FBS0M7QUFBQSxVQUFFO0FBQUMsZUFBTyxFQUFFLEdBQUVELEVBQUM7QUFBQSxNQUFDLEdBQUUsRUFBRSxhQUFXLFNBQVNMLElBQUVFLElBQUU7QUFBQyxZQUFJQztBQUFFLGNBQUtELEtBQUVBLE1BQUdGLEdBQUUsVUFBUUEsR0FBRSxXQUFTRSxLQUFFRixHQUFFLFNBQVFHLEtBQUVELEtBQUUsR0FBRSxLQUFHQyxNQUFHLFFBQU0sTUFBSUgsR0FBRUcsRUFBQztBQUFJLFVBQUFBO0FBQUksZUFBT0EsS0FBRSxJQUFFRCxLQUFFLE1BQUlDLEtBQUVELEtBQUVDLEtBQUUsRUFBRUgsR0FBRUcsRUFBQyxDQUFDLElBQUVELEtBQUVDLEtBQUVEO0FBQUEsTUFBQztBQUFBLElBQUMsR0FBRSxFQUFDLFlBQVcsR0FBRSxDQUFDLEdBQUUsSUFBRyxDQUFDLFNBQVMsR0FBRSxHQUFFLEdBQUU7QUFBYyxRQUFFLFVBQVEsU0FBU0YsSUFBRUUsSUFBRUMsSUFBRSxHQUFFO0FBQUMsaUJBQVEsSUFBRSxRQUFNSCxLQUFFLEdBQUUsSUFBRUEsT0FBSSxLQUFHLFFBQU0sR0FBRSxJQUFFLEdBQUUsTUFBSUcsTUFBRztBQUFDLGVBQUlBLE1BQUcsSUFBRSxNQUFJQSxLQUFFLE1BQUlBLElBQUUsSUFBRSxLQUFHLElBQUUsSUFBRUQsR0FBRSxHQUFHLElBQUUsS0FBRyxHQUFFLEVBQUU7QUFBRztBQUFDLGVBQUcsT0FBTSxLQUFHO0FBQUEsUUFBSztBQUFDLGVBQU8sSUFBRSxLQUFH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QUFLLFNBQVMsR0FBRSxFQUFFLEtBQUssT0FBTyxHQUFFLEtBQUssU0FBTyxNQUFLLEtBQUssU0FBTyxNQUFLLEtBQUssVUFBUSxNQUFLLEtBQUssV0FBUyxJQUFJLEVBQUUsTUFBTSxJQUFFLENBQUMsR0FBRSxLQUFLLE9BQUssSUFBSSxFQUFFLE1BQU0sSUFBRSxJQUFFLENBQUMsR0FBRSxFQUFFLEtBQUssSUFBSSxHQUFFLEtBQUssV0FBUyxHQUFFLEtBQUssV0FBUyxHQUFFLEtBQUssUUFBTSxJQUFJLEVBQUUsTUFBTSxJQUFFLElBQUUsQ0FBQyxHQUFFLEVBQUUsS0FBSyxLQUFLLEdBQUUsS0FBSyxRQUFNLEdBQUUsS0FBSyxjQUFZLEdBQUUsS0FBSyxXQUFTLEdBQUUsS0FBSyxRQUFNLEdBQUUsS0FBSyxVQUFRLEdBQUUsS0FBSyxhQUFXLEdBQUUsS0FBSyxVQUFRLEdBQUUsS0FBSyxTQUFPLEdBQUUsS0FBSyxTQUFPLEdBQUUsS0FBSyxXQUFTO0FBQUEsTUFBQztBQUFDLGVBQVMsRUFBRU4sSUFBRTtBQUFDLFlBQUlFO0FBQUUsZUFBT0YsTUFBR0EsR0FBRSxTQUFPQSxHQUFFLFdBQVNBLEdBQUUsWUFBVSxHQUFFQSxHQUFFLFlBQVUsSUFBR0UsS0FBRUYsR0FBRSxPQUFPLFVBQVEsR0FBRUUsR0FBRSxjQUFZLEdBQUVBLEdBQUUsT0FBSyxNQUFJQSxHQUFFLE9BQUssQ0FBQ0EsR0FBRSxPQUFNQSxHQUFFLFNBQU9BLEdBQUUsT0FBSyxJQUFFLEdBQUVGLEdBQUUsUUFBTSxNQUFJRSxHQUFFLE9BQUssSUFBRSxHQUFFQSxHQUFFLGFBQVcsR0FBRSxFQUFFLFNBQVNBLEVBQUMsR0FBRSxLQUFHLEVBQUVGLElBQUUsQ0FBQztBQUFBLE1BQUM7QUFBQyxlQUFTLEVBQUVBLElBQUU7QUFBQyxZQUFJRSxLQUFFLEVBQUVGLEVBQUM7QUFBRSxlQUFPRSxPQUFJLEtBQUcsU0FBU0YsSUFBRTtBQUFDLFVBQUFBLEdBQUUsY0FBWSxJQUFFQSxHQUFFLFFBQU8sRUFBRUEsR0FBRSxJQUFJLEdBQUVBLEdB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QUlDLElBQUVFLElBQUVDLElBQUVDO0FBQUUsWUFBRyxDQUFDUCxNQUFHLENBQUNBLEdBQUUsU0FBTyxJQUFFRSxNQUFHQSxLQUFFO0FBQUUsaUJBQU9GLEtBQUUsRUFBRUEsSUFBRSxDQUFDLElBQUU7QUFBRSxZQUFHSyxLQUFFTCxHQUFFLE9BQU0sQ0FBQ0EsR0FBRSxVQUFRLENBQUNBLEdBQUUsU0FBTyxNQUFJQSxHQUFFLFlBQVUsUUFBTUssR0FBRSxVQUFRSCxPQUFJO0FBQUUsaUJBQU8sRUFBRUYsSUFBRSxNQUFJQSxHQUFFLFlBQVUsS0FBRyxDQUFDO0FBQUUsWUFBR0ssR0FBRSxPQUFLTCxJQUFFRyxLQUFFRSxHQUFFLFlBQVdBLEdBQUUsYUFBV0gsSUFBRUcsR0FBRSxXQUFTO0FBQUUsY0FBRyxNQUFJQSxHQUFFO0FBQUssWUFBQUwsR0FBRSxRQUFNLEdBQUUsRUFBRUssSUFBRSxFQUFFLEdBQUUsRUFBRUEsSUFBRSxHQUFHLEdBQUUsRUFBRUEsSUFBRSxDQUFDLEdBQUVBLEdBQUUsVUFBUSxFQUFFQSxLQUFHQSxHQUFFLE9BQU8sT0FBSyxJQUFFLE1BQUlBLEdBQUUsT0FBTyxPQUFLLElBQUUsTUFBSUEsR0FBRSxPQUFPLFFBQU0sSUFBRSxNQUFJQSxHQUFFLE9BQU8sT0FBSyxJQUFFLE1BQUlBLEdBQUUsT0FBTyxVQUFRLEtBQUcsRUFBRSxHQUFFLEVBQUVBLElBQUUsTUFBSUEsR0FBRSxPQUFPLElBQUksR0FBRSxFQUFFQSxJQUFFQSxHQUFFLE9BQU8sUUFBTSxJQUFFLEdBQUcsR0FBRSxFQUFFQSxJQUFFQSxHQUFFLE9BQU8sUUFBTSxLQUFHLEdBQUcsR0FBRSxFQUFFQSxJQUFFQSxHQUFFLE9BQU8sUUFBTSxLQUFHLEdBQUcsR0FBRSxFQUFFQSxJQUFFLE1BQUlBLEdBQUUsUUFBTSxJQUFFLEtBQUdBLEdBQUUsWUFBVUEsR0FBRSxRQUFNLElBQUUsSUFBRSxDQUFDLEdBQUUsRUFBRUEsSUFBRSxNQUFJQSxHQUFFLE9BQU8sRUFBRSxHQUFFQSxHQUFFLE9BQU8sU0FBT0EsR0FBRSxP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LEVBQUUsU0FBUyxHQUFFLElBQUUsRUFBRSxXQUFXLEdBQUUsSUFBRSxFQUFFLFlBQVksR0FBRSxJQUFFLEdBQUUsSUFBRSxHQUFFLElBQUUsR0FBRSxJQUFFLElBQUcsSUFBRSxHQUFFLElBQUUsS0FBSSxJQUFFO0FBQUksZUFBUyxFQUFFSCxJQUFFO0FBQUMsZ0JBQU9BLE9BQUksS0FBRyxRQUFNQSxPQUFJLElBQUUsV0FBUyxRQUFNQSxPQUFJLE9BQUssTUFBSUEsT0FBSTtBQUFBLE1BQUc7QUFBQyxlQUFTLElBQUc7QUFBQyxhQUFLLE9BQUssR0FBRSxLQUFLLE9BQUssT0FBRyxLQUFLLE9BQUssR0FBRSxLQUFLLFdBQVMsT0FBRyxLQUFLLFFBQU0sR0FBRSxLQUFLLE9BQUssR0FBRSxLQUFLLFFBQU0sR0FBRSxLQUFLLFFBQU0sR0FBRSxLQUFLLE9BQUssTUFBSyxLQUFLLFFBQU0sR0FBRSxLQUFLLFFBQU0sR0FBRSxLQUFLLFFBQU0sR0FBRSxLQUFLLFFBQU0sR0FBRSxLQUFLLFNBQU8sTUFBSyxLQUFLLE9BQUssR0FBRSxLQUFLLE9BQUssR0FBRSxLQUFLLFNBQU8sR0FBRSxLQUFLLFNBQU8sR0FBRSxLQUFLLFFBQU0sR0FBRSxLQUFLLFVBQVEsTUFBSyxLQUFLLFdBQVMsTUFBSyxLQUFLLFVBQVEsR0FBRSxLQUFLLFdBQVMsR0FBRSxLQUFLLFFBQU0sR0FBRSxLQUFLLE9BQUssR0FBRSxLQUFLLFFBQU0sR0FBRSxLQUFLLE9BQUssR0FBRSxLQUFLLE9BQUssTUFBSyxLQUFLLE9BQUssSUFBSSxFQUFFLE1BQU0sR0FBRyxHQUFFLEtBQUssT0FBSyxJQUFJLEVBQUUsTUFBTSxHQUFHLEdBQUUsS0FBSyxTQUFPLE1BQUssS0FBSyxVQUFRLE1BQUssS0FBSyxPQUFLLEdBQUUsS0FBSyxPQUFLLEdBQUUsS0FBSyxNQUFJO0FBQUEsTUFBQztBQUFDLGVBQVMsRUFBRUEsSUFBRTtBQUFDLFlBQUlFO0FBQUUsZUFBT0YsTUFBR0EsR0FBRSxTQUFPRSxLQUFFRixHQUFFLE9BQU1BLEdBQUUsV0FBU0Es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T0FBTSxPQUFNLEdBQUUsQ0FBQyxHQUFFLElBQUUsQ0FBQyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLEVBQUU7QUFBRSxRQUFFLFVBQVEsU0FBU0gsSUFBRUUsSUFBRUMsSUFBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUU7QUFBQyxZQUFJLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLElBQUUsRUFBRSxNQUFLLElBQUUsR0FBRSxJQUFFLEdBQUUsSUFBRSxHQUFFLElBQUUsR0FBRSxJQUFFLEdBQUUsSUFBRSxHQUFFLElBQUUsR0FBRSxJQUFFLEdBQUUsSUFBRSxHQUFFLElBQUUsR0FBRSxJQUFFLE1BQUssSUFBRSxHQUFFLElBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFFLElBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFFLElBQUUsTUFBSyxJQUFFO0FBQUUsYUFBSSxJQUFFLEdBQUUsS0FBRyxJQUFHO0FBQUksWUFBRSxDQUFDLElBQUU7QUFBRSxhQUFJLElBQUUsR0FBRSxJQUFFLEdBQUU7QUFBSSxZQUFFRCxHQUFFQyxLQUFFLENBQUMsQ0FBQztBQUFJLGFBQUksSUFBRSxHQUFFLElBQUUsSUFBRyxLQUFHLEtBQUcsTUFBSSxFQUFFLENBQUMsR0FBRTtBQUFJO0FBQUMsWUFBRyxJQUFFLE1BQUksSUFBRSxJQUFHLE1BQUk7QUFBRSxpQkFBTyxFQUFFLEdBQUcsSUFBRSxVQUFTLEVBQUUsR0FBRyxJQUFFLFVBQVMsRUFBRSxPQUFLLEdBQUU7QUFBRSxhQUFJLElBQUUsR0FBRSxJQUFFLEtBQUcsTUFBSSxFQUFFLENBQUMsR0FBRTtBQUFJO0FBQUMsYUFBSSxJQUFFLE1BQUksSUFBRSxJQUFHLElBQUUsSUFBRSxHQUFFLEtBQUcsSUFBRztBQUFJLGNBQUcsTUFBSSxJQUFHLEtBQUcsRUFBRSxDQUFDLEtBQUc7QUFBRSxtQkFBTTtBQUFHLFlBQUcsSUFBRSxNQUFJLE1BQUlILE1BQUcsTUFBSTtBQUFHLGlCQUFNO0FBQUcsYUFBSSxFQUFFLENBQUMsSUFBRSxHQUFFLElBQUUsR0FBRSxJQUFFLElBQUc7QUFBSSxZQUFFLElBQUUsQ0FBQyxJQUFFLEVBQUUsQ0FBQyxJQUFFLEVBQUUsQ0FBQztBQUFFLGFBQUksSUFBRSxHQUFFLElBQUUsR0FBRTtBQUFJLGdCQUFJRSxHQUFFQyxLQUFFLENBQUMsTUFBSSxFQUFFLEVBQUVELEdBQUVDLEtBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBRTtBQUFHLFlBQUcsSUFBRSxNQUFJSCxNQUFHLElBQUUsSUFBRSxHQUFFLE1BQUksTUFBSUEsTUFBRyxJQUFFLEdBQUUsS0FBRyxLQUFJLElBQUUsR0FBRSxLQUFHLEtBQUksUUFBTSxJQUFFLEdBQUUsSUFBRSxHQUFFLEtBQUksSUFBRSxHQUFFLElBQUUsR0FBRSxJQUFFLElBQUUsSUFBRSxHQUFFLElBQUUsSUFBRyxLQUFHLElBQUUsTUFBSSxJQUFFLE1BQUksR0FBRSxNQUFJQSxNQUFHLE1BQUksS0FBRyxNQUFJQSxNQUFHLE1BQUk7QUFBRSxpQkFBTztBQUFFLG1CQUFPO0FBQUMsZUFBSSxJQUFFLElBQUUsR0FBRSxJQUFFLEVBQUUsQ0FBQyxJQUFFLEtBQUcsSUFBRSxHQUFFLEVBQUUsQ0FBQyxLQUFHLEVBQUUsQ0FBQyxJQUFFLEtBQUcsSUFBRSxFQUFFLElBQUUsRUFBRSxDQUFDLENBQUMsR0FBRSxFQUFFLElBQUUsRUFBRSxDQUFDLENBQUMsTUFBSSxJQUFFLElBQUcsSUFBRyxJQUFFLEtBQUcsSUFBRSxHQUFFLElBQUUsSUFBRSxLQUFHLEdBQUUsRUFBRSxLQUFHLEtBQUcsTUFBSSxLQUFHLEVBQUUsSUFBRSxLQUFHLEtBQUcsS0FBRyxLQUFHLElBQUUsR0FBRSxNQUFJO0FBQUc7QUFBQyxlQUFJLElBQUUsS0FBRyxJQUFFLEdBQUUsSUFBRTtBQUFHLGtCQUFJO0FBQUUsY0FBRyxNQUFJLEtBQUcsS0FBRyxJQUFFLEdBQUUsS0FBRyxLQUFHLElBQUUsR0FBRSxLQUFJLEtBQUcsRUFBRSxFQUFFLENBQUMsR0FBRTtBQUFDLGdCQUFHLE1BQUk7QUFBRTtBQUFNLGdCQUFFRSxHQUFFQyxLQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQUEsVUFBQztBQUFDLGNBQUcsSUFBRSxNQUFJLElBQUUsT0FBSyxHQUFFO0FBQUMsaUJBQUksTUFBSSxNQUFJLElBQUUsSUFBRyxLQUFHLEdBQUUsSUFBRSxNQUFJLElBQUUsSUFBRSxJQUFHLElBQUUsSUFBRSxLQUFHLEdBQUcsS0FBRyxFQUFFLElBQUUsQ0FBQyxNQUFJO0FBQUksbUJBQUksTUFBSTtBQUFFLGdCQUFHLEtBQUcsS0FBRyxHQUFFLE1BQUlILE1BQUcsTUFBSSxLQUFHLE1BQUlBLE1BQUcsTUFBSTtBQUFFLHFCQUFPO0FBQUUsY0FBRSxJQUFFLElBQUUsQ0FBQyxJQUFFLEtBQUcsS0FBRyxLQUFHLEtBQUcsSUFBRSxJQUFFO0FBQUEsVUFBQztBQUFBLFFBQUM7QUFBQyxlQUFPLE1BQUksTUFBSSxFQUFFLElBQUUsQ0FBQyxJQUFFLElBQUUsS0FBRyxLQUFHLE1BQUksS0FBRyxJQUFHLEVBQUUsT0FBSyxHQUFFO0FBQUEsTUFBQztBQUFBLElBQUMsR0FBRSxFQUFDLG1CQUFrQixHQUFFLENBQUMsR0FBRSxJQUFHLENBQUMsU0FBUyxHQUFFLEdBQUUsR0FBRTtBQUFjLFFBQUUsVUFBUSxFQUFDLEdBQUUsbUJBQWtCLEdBQUUsY0FBYSxHQUFFLElBQUcsTUFBSyxjQUFhLE1BQUssZ0JBQWUsTUFBSyxjQUFhLE1BQUssdUJBQXNCLE1BQUssZ0JBQWUsTUFBSyx1QkFBc0I7QUFBQSxJQUFDLEdBQUUsQ0FBRSxDQUFBLEdBQUUsSUFBRyxDQUFDLFNBQVMsR0FBRSxHQUFFLEdBQUU7QUFBYyxVQUFJLElBQUUsRUFBRSxpQkFBaUIsR0FBRSxJQUFFLEdBQUUsSUFBRTtBQUFFLGVBQVMsRUFBRUEsSUFBRTtBQUFDLGlCQUFRRSxLQUFFRixHQUFFLFFBQU8sS0FBRyxFQUFFRTtBQUFHLFVBQUFGLEdBQUVFLEVBQUMsSUFBRTtBQUFBLE1BQUM7QUFBQyxVQUFJLElBQUUsR0FBRSxJQUFFLElBQUcsSUFBRSxLQUFJLElBQUUsSUFBRSxJQUFFLEdBQUUsSUFBRSxJQUFHLElBQUUsSUFBRyxJQUFFLElBQUUsSUFBRSxHQUFFLElBQUUsSUFBRyxJQUFFLElBQUcsSUFBRSxHQUFFLElBQUUsS0FBSSxJQUFFLElBQUcsSUFBRSxJQUFHLElBQUUsSUFBRyxJQUFFLENBQUMsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxDQUFDLEdBQUUsSUFBRSxDQUFDLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsSUFBRyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsSUFBRyxFQUFFLEdBQUUsSUFBRSxDQUFDLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLENBQUMsR0FBRSxJQUFFLENBQUMsSUFBRyxJQUFHLElBQUcsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLElBQUcsR0FBRSxJQUFHLEdBQUUsSUFBRyxHQUFFLElBQUcsR0FBRSxJQUFHLEdBQUUsRUFBRSxHQUFFLElBQUUsSUFBSSxNQUFNLEtBQUcsSUFBRSxFQUFFO0FBQUUsUUFBRSxDQUFDO0FBQUUsVUFBSSxJQUFFLElBQUksTUFBTSxJQUFFLENBQUM7QUFBRSxRQUFFLENBQUM7QUFBRSxVQUFJLElBQUUsSUFBSSxNQUFNLEdBQUc7QUFBRSxRQUFFLENBQUM7QUFBRSxVQUFJLElBQUUsSUFBSSxNQUFNLEdBQUc7QUFBRSxRQUFFLENBQUM7QUFBRSxVQUFJLElBQUUsSUFBSSxNQUFNLENBQUM7QUFBRSxRQUFFLENBQUM7QUFBRSxVQUFJLEdBQUUsR0FBRSxHQUFFLElBQUUsSUFBSSxNQUFNLENBQUM7QUFBRSxlQUFTLEVBQUVGLElBQUVFLElBQUVDLElBQUVFLElBQUVDLElBQUU7QUFBQyxhQUFLLGNBQVlOLElBQUUsS0FBSyxhQUFXRSxJQUFFLEtBQUssYUFBV0MsSUFBRSxLQUFLLFFBQU1FLElBQUUsS0FBSyxhQUFXQyxJQUFFLEtBQUssWUFBVU4sTUFBR0EsR0FBRTtBQUFBLE1BQU07QUFBQyxlQUFTLEVBQUVBLElBQUVFLElBQUU7QUFBQyxhQUFLLFdBQVNGLElBQUUsS0FBSyxXQUFTLEdBQUUsS0FBSyxZQUFVRTtBQUFBLE1BQUM7QUFBQyxlQUFTLEVBQUVGLElBQUU7QUFBQyxlQUFPQSxLQUFFLE1BQUksRUFBRUEsRUFBQyxJQUFFLEVBQUUsT0FBS0EsT0FBSSxFQUFFO0FBQUEsTUFBQztBQUFDLGVBQVMsRUFBRUEsSUFBRUUsSUFBRTtBQUFDLFFBQUFGLEdBQUUsWUFBWUEsR0FBRSxTQUFTLElBQUUsTUFBSUUsSUFBRUYsR0FBRSxZQUFZQSxHQUFFLFNBQVMsSUFBRUUsT0FBSSxJQUFFO0FBQUEsTUFBRztBQUFDLGVBQVMsRUFBRUYsSUFBRUUsSUFBRUMsSUFBRTtBQUFDLFFBQUFILEdBQUUsV0FBUyxJQUFFRyxNQUFHSCxHQUFFLFVBQVFFLE1BQUdGLEdBQUUsV0FBUyxPQUFNLEVBQUVBLElBQUVBLEdBQUUsTUFBTSxHQUFFQSxHQUFFLFNBQU9FLE1BQUcsSUFBRUYsR0FBRSxVQUFTQSxHQUFFLFlBQVVHLEtBQUUsTUFBSUgsR0FBRSxVQUFRRSxNQUFHRixHQUFFLFdBQVMsT0FBTUEsR0FBRSxZQUFVRztBQUFBLE1BQUU7QUFBQyxlQUFTLEVBQUVILElBQUVFLElBQUVDLElBQUU7QUFBQyxVQUFFSCxJQUFFRyxHQUFFLElBQUVELEVBQUMsR0FBRUMsR0FBRSxJQUFFRCxLQUFFLENBQUMsQ0FBQztBQUFBLE1BQUM7QUFBQyxlQUFTLEVBQUVGLElBQUVFLElBQUU7QUFBQyxpQkFBUUMsS0FBRSxHQUFFQSxNQUFHLElBQUVILElBQUVBLFFBQUssR0FBRUcsT0FBSSxHQUFFLElBQUUsRUFBRUQ7QUFBRztBQUFDLGVBQU9DLE9BQUk7QUFBQSxNQUFDO0FBQUMsZUFBUyxFQUFFSCxJQUFFRSxJQUFFQyxJQUFFO0FBQUMsWUFBSUUsSUFBRUMsSUFBRUMsS0FBRSxJQUFJLE1BQU0sSUFBRSxDQUFDLEdBQUVDLEtBQUU7QUFBRSxhQUFJSCxLQUFFLEdBQUVBLE1BQUcsR0FBRUE7QUFBSSxVQUFBRSxHQUFFRixFQUFDLElBQUVHLEtBQUVBLEtBQUVMLEdBQUVFLEtBQUUsQ0FBQyxLQUFHO0FBQUUsYUFBSUMsS0FBRSxHQUFFQSxNQUFHSixJQUFFSSxNQUFJO0FBQUMsY0FBSUcsS0FBRVQsR0FBRSxJQUFFTSxLQUFFLENBQUM7QUFBRSxnQkFBSUcsT0FBSVQsR0FBRSxJQUFFTSxFQUFDLElBQUUsRUFBRUMsR0FBRUUsRUFBQyxLQUFJQSxFQUFDO0FBQUEsUUFBRTtBQUFBLE1BQUM7QUFBQyxlQUFTLEVBQUVULElBQUU7QUFBQyxZQUFJRTtBQUFFLGFBQUlBLEtBQUUsR0FBRUEsS0FBRSxHQUFFQTtBQUFJLFVBQUFGLEdBQUUsVUFBVSxJQUFFRSxFQUFDLElBQUU7QUFBRSxhQUFJQSxLQUFFLEdBQUVBLEtBQUUsR0FBRUE7QUFBSSxVQUFBRixHQUFFLFVBQVUsSUFBRUUsRUFBQyxJQUFFO0FBQUUsYUFBSUEsS0FBRSxHQUFFQSxLQUFFLEdBQUVBO0FBQUksVUFBQUYsR0FBRSxRQUFRLElBQUVFLEVBQUMsSUFBRTtBQUFFLFFBQUFGLEdBQUUsVUFBVSxJQUFFLENBQUMsSUFBRSxHQUFFQSxHQUFFLFVBQVFBLEdBQUUsYUFBVyxHQUFFQSxHQUFFLFdBQVNBLEdBQUUsVUFBUTtBQUFBLE1BQUM7QUFBQyxlQUFTLEVB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TixJQUFFRSxLQUFFLEtBQUksQ0FBQyxHQUFFLEVBQUVGLElBQUVHLEtBQUUsR0FBRSxDQUFDLEdBQUUsRUFBRUgsSUFBRUssS0FBRSxHQUFFLENBQUMsR0FBRUMsS0FBRSxHQUFFQSxLQUFFRCxJQUFFQztBQUFJLGNBQUVOLElBQUVBLEdBQUUsUUFBUSxJQUFFLEVBQUVNLEVBQUMsSUFBRSxDQUFDLEdBQUUsQ0FBQztBQUFFLFlBQUVOLElBQUVBLEdBQUUsV0FBVUUsS0FBRSxDQUFDLEdBQUUsRUFBRUYsSUFBRUEsR0FBRSxXQUFVRyxLQUFFLENBQUM7QUFBQSxRQUFDLEVBQUVILElBQUVBLEdBQUUsT0FBTyxXQUFTLEdBQUVBLEdBQUUsT0FBTyxXQUFTLEdBQUVRLEtBQUUsQ0FBQyxHQUFFLEVBQUVSLElBQUVBLEdBQUUsV0FBVUEsR0FBRSxTQUFTLElBQUcsRUFBRUEsRUFBQyxHQUFFSyxNQUFHLEVBQUVMLEVBQUM7QUFBQSxNQUFDLEdBQUUsRUFBRSxZQUFVLFNBQVNBLElBQUVFLElBQUVDLElBQUU7QUFBQyxlQUFPSCxHQUFFLFlBQVlBLEdBQUUsUUFBTSxJQUFFQSxHQUFFLFFBQVEsSUFBRUUsT0FBSSxJQUFFLEtBQUlGLEdBQUUsWUFBWUEsR0FBRSxRQUFNLElBQUVBLEdBQUUsV0FBUyxDQUFDLElBQUUsTUFBSUUsSUFBRUYsR0FBRSxZQUFZQSxHQUFFLFFBQU1BLEdBQUUsUUFBUSxJQUFFLE1BQUlHLElBQUVILEdBQUUsWUFBVyxNQUFJRSxLQUFFRixHQUFFLFVBQVUsSUFBRUcsRUFBQyxPQUFLSCxHQUFFLFdBQVVFLE1BQUlGLEdBQUUsVUFBVSxLQUFHLEVBQUVHLEVBQUMsSUFBRSxJQUFFLEVBQUUsS0FBSUgsR0FBRSxVQUFVLElBQUUsRUFBRUUsRUFBQyxDQUFDLE1BQUtGLEdBQUUsYUFBV0EsR0FBRSxjQUFZO0FBQUEsTUFBQyxHQUFFLEVBQUUsWUFBVSxTQUFTQSxJQUFFO0FBQUMsVUFBRUEsSUFBRSxHQUFFLENBQUMsR0FBRSxFQUFFQSxJQUFFLEdBQUUsQ0FBQyxHQUFFLFNBQVNB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
