"use strict";

import {deleteSync} from "del";

export const clean = async () => (deleteSync(["./dist/*"]));