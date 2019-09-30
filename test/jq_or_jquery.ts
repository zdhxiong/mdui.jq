import JQ from '../es/index';
import { JQStatic } from '../es/interfaces/JQStatic';

const $ = typeof jQuery !== 'undefined' ? jQuery : JQ;

export default $ as JQStatic;
