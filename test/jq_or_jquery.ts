import JQ from '../src/index';
import { JQStatic } from '../es/interfaces/JQStatic';

const $ = typeof jQuery !== 'undefined' ? jQuery : JQ;

export default $ as JQStatic;
