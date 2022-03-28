import mixpanel from "mixpanel-browser";
mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);

let env_check = process.env.NODE_ENV === "production";

let actions = {
  identify: (id) => {
    if (env_check) mixpanel.identify(id);
  },
  alias: (id) => {
    if (env_check) mixpanel.alias(id);
  },
  track: (name, props) => {
    if (env_check) mixpanel.track(name, props);
  },
  people: {
    set: (props) => {
      if (env_check) mixpanel.people.set(props);
    },
  },
  register_once: (props) => {
    if (env_check) mixpanel.register_once(props);
  },
};

export let Mixpanel = actions;
