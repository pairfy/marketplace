import './assets/main.css'
import 'primeicons/primeicons.css'
import "./assets/flags.css";

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { stores } from "./store";

import PrimeVue from 'primevue/config';


import Button from "primevue/button"
import Toolbar from 'primevue/toolbar';
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import SplitButton from 'primevue/splitbutton';
import Breadcrumb from 'primevue/breadcrumb';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import KeyFilter from 'primevue/keyfilter';
import Checkbox from 'primevue/checkbox';
import Select from 'primevue/select';
import ColorPicker from 'primevue/colorpicker';
import ToggleSwitch from 'primevue/toggleswitch';
import AutoComplete from 'primevue/autocomplete';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';
import Badge from 'primevue/badge';
import OverlayBadge from 'primevue/overlaybadge';
import Message from 'primevue/message';
import SelectButton from 'primevue/selectbutton';
import Fluid from 'primevue/fluid';
import Password from 'primevue/password';
import IftaLabel from 'primevue/iftalabel';
import Divider from 'primevue/divider';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   
import Row from 'primevue/row';                   
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import Image from 'primevue/image';
import Skeleton from 'primevue/skeleton';
import Rating from 'primevue/rating';
import Drawer from 'primevue/drawer';
import Popover from 'primevue/popover';

import Tooltip from 'primevue/tooltip';
import Ripple from 'primevue/ripple';
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice';
import { MyPreset } from './assets/theme';



const app = createApp(App)

app.use(stores);
app.use(router)

app.use(PrimeVue, {
    ripple: true,
    theme: {
        preset: MyPreset
    }
});

app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);


app.component('Button', Button);
app.component('Toolbar', Toolbar);
app.component('IconField', IconField);
app.component('InputIcon', InputIcon);
app.component('InputText', InputText);
app.component('SplitButton', SplitButton);
app.component('Breadcrumb', Breadcrumb);
app.component('InputGroup', InputGroup);
app.component('InputGroupAddon', InputGroupAddon);
app.component('Checkbox', Checkbox);
app.component('Select', Select);
app.component('ColorPicker', ColorPicker);
app.component('ToggleSwitch', ToggleSwitch);
app.component('AutoComplete', AutoComplete);
app.component('FileUpload', FileUpload);
app.component('ProgressBar', ProgressBar);
app.component('Badge', Badge);
app.component('OverlayBadge', OverlayBadge);
app.component('Message', Message);
app.component('SelectButton', SelectButton);
app.component('Fluid', Fluid);
app.component('Password', Password);
app.component('IftaLabel', IftaLabel);
app.component('Divider', Divider);
app.component('Toast', Toast);
app.component('Dialog', Dialog);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.component('Tag', Tag);
app.component('InputNumber', InputNumber);
app.component('Textarea', Textarea);
app.component('Image', Image);
app.component('Skeleton', Skeleton);
app.component('Rating', Rating);
app.component('Drawer', Drawer);
app.component('Popover', Popover);



app.directive('keyfilter', KeyFilter);
app.directive('ripple', Ripple);
app.directive('tooltip', Tooltip);


app.mount('#app')