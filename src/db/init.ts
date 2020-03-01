import {environment} from "../environment/environment";
import {Path, PathSchema, PathVisibility} from "../modules/path/path.schema";

const mongoose = require('mongoose');


mongoose.connect(`${environment.db.url}/${environment.db.name}`, {useNewUrlParser: true}).then(async () => {
  for (let i = 0; i < 10; i++) {
    new mongoose.model('Path', PathSchema, environment.db.name)(<Path>{
      path: {
        "type": "LineString",
        "coordinates": [
          [18.919830322265625,47.38905261221537],
          [19.13543701171875,47.296462208519344],
          [18.854598999023438,47.194378517083486],
          [19.255599975585938,47.1514353582905],
          [18.678131103515625,47.116401654426745],
          [18.675384521484375,47.3704545156932]
        ]
      },
      visibility: PathVisibility.PUBLIC,

    }).save();
  }
});
