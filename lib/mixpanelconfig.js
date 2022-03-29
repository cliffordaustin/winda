import mixpanel from "mixpanel-browser";

// NB: CHANGE DEBUG TO FALSE IN PRODUCTION
mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
  debug: true,
  ignore_dnt: true,
});

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
    if (env_check) {
      console.log(
        "From the production ",
        process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
      );
      mixpanel.register(props);
    }
  },
};

export let Mixpanel = actions;
