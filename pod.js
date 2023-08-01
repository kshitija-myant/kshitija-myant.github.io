
let myDevice;
function onDisconnected(event) {
    const device = event.target;
    console.log(`Device ${device.name} is disconnected.`, myDevice);
}

function getDeviceInfo() {
    // console.log("hello")
    // let options = {
    //     acceptAllDevices: true
    // }
    // navigator.bluetooth.requestDevice(options).then(devices => {
    //     console.log('Name: '+ devices.name)
    // }).catch(error => {
    //     console.log(('Request device error ' +error))
    // })
    navigator.bluetooth.requestDevice({ filters: [{
        manufacturerData: [{
          companyIdentifier: 0x0059
        }],
        optionalServices: ['device_information', "0000180a-0000-1000-8000-00805f9b34fb"]
      }] })
    .then(device => {
    // Human-readable name of the device.
    myDevice = device
    device.addEventListener('gattserverdisconnected', onDisconnected);
    console.log("Device connected", myDevice);
    let result = BluetoothUUID.getService("device_information");
      console.log("hello "+result); 
    // Attempts to connect to remote GATT Server.
    return device.gatt.connect();
    })
      .then(server => {
        console.log('Getting Device Information Service...');
        return server.getPrimaryService('0000180a-0000-1000-8000-00805f9b34fb');
      })
      // .then(service => {
      //   console.log('Getting Device Information Characteristics...');
      //   return service.getCharacteristics();
      // })
      // .then(characteristics => {
      //   let queue = Promise.resolve();
      //   let decoder = new TextDecoder('utf-8');

      //   characteristics.forEach(characteristic => {
      //       BluetoothUUID.getCharacteristic('manufacturer_name_string')
      //       queue = queue.then(_ => characteristic.readValue()).then(value => {
      //         console.log('> Manufacturer Name String: ' + decoder.decode(value));
      //       });
        //     switch (characteristic.uuid) {
        //         case BluetoothUUID.getCharacteristic('manufacturer_name_string'):
        //   queue = queue.then(_ => characteristic.readValue()).then(value => {
        //     console.log('> Manufacturer Name String: ' + decoder.decode(value));
        //   });
        //   break;

        //   case BluetoothUUID.getCharacteristic('model_number_string'):
        //   queue = queue.then(_ => characteristic.readValue()).then(value => {
        //     console.log('> Model Number String: ' + decoder.decode(value));
        //   });
        //   break;
        //         default: log('> Unknown Characteristic: ' + characteristic.uuid);
           //}
       //    });  
    //})
    .catch(error => { console.error(error) });
}

window.onload = ()=>{
    document.getElementById("mybtn").addEventListener("click", function() {
        getDeviceInfo();
    })
}
