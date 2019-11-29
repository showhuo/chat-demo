import Bluebird from "bluebird";

Bluebird.config({ warnings: false, longStackTraces: true });

window.Bluebird = Bluebird;
