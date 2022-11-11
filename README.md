# update / upgrade
`sudo apt update && sudo apt upgrade -y`

# install essentials
`sudo curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -`

`sudo apt install -y git libwidevinecdm0 python3-setuptools python3-pip screen nodejs build-essential libasound2-dev pulseaudio libgl1-mesa-dri libgl1-mesa-glx libgles2 libgles2-mesa`

# lte setup

`sudo raspi-config`

`Interface Options > Serial Port` login shell = NO / hardware = YES

`Interface Options > I2C` enable

`System Options > Boot / Auto Login` Console Autologin Text console

**finish** and reboot

`git clone https://github.com/sixfab/Sixfab_RPi_CellularIoT_App_Shield.git`

`sudo python3 ./Sixfab_RPi_CellularIoT_App_Shield/setup.py install`

`git clone https://github.com/sixfab/Sixfab_PPP_Installer.git`

`cd Sixfab_PPP_Installer`

`sudo nano src/reconnect_scripts/reconnect_basehat`

remove following lines:
`gpio -g mode $W_DISABLE` `gpio -g write $W_DISABLE 0`

`chmod +x ppp_install.sh`

`sudo ./ppp_install.sh`

Select `6: 3G/4G Base Hat`

APN Enter `dr.m2m.ch`

Username / Password Enter `n`

Port Enter `ttyUSB2`

Autoreconnect Enter `Y`

**Press ENTER key to reboot**

# chromium setup
`sudo apt install -y --no-install-recommends xserver-xorg x11-xserver-utils xinit openbox chromium-browser`

`sudo nano /etc/xdg/openbox/autostart`

```
# Disable any form of screen saver / screen blanking / power management
xset s off
xset s noblank
xset -dpms

# Allow quitting the X server with CTRL-ATL-Backspace
setxkbmap -option terminate:ctrl_alt_bksp

# Start Chromium in kiosk mode
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' ~/.config/chromium/'Local State'
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]\+"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences
chromium-browser --disable-infobars --enable-webgl --ignore-gpu-blacklist --kiosk 'http://localhost:3000'
```

`sudo nano ~/.bash_profile`

```
screen -dmS ppp sudo pon
screen -dmS carmedia node ~/carmedia/.output/server/index.mjs
screen -dmS carmedia_update sh ~/update.sh
[[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && startx -- -nocursor
```

# hifiberry setup
`sudo nano /boot/config.txt`

remove following line: `dtparam=audio=on`

change `dtoverlay=vc4-kms-v3d` to `dtoverlay=vc4-kms-v3d,audio=off`

add following lines: `dtoverlay=hifiberry-dacplus`

`sudo nano /etc/asound.conf`

```
pcm.!default {
  type hw card 0
}
ctl.!default {
  type hw card 0
}
```

# fastboot

`sudo nano /boot/config.txt`

```
disable_splash=1
boot_delay=0
arm_boost=1
gpu_mem=64
```

`sudo nano /boot/cmdline.txt`

remove `spash`
add `quiet` after rootwait

# setup carmedia app
`sudo git clone https://github.com/Ayax0/carmedia.git`

`sudo git clone https://github.com/Ayax0/carmedia-keyboard.git`

`sudo chmod -R 777 ~/carmedia`

`sudo nano /home/pi/update.sh`

```
#!/bin/sh
cd ~/carmedia-keyboard
sudo git pull

cd ~/carmedia
sudo git pull
sudo npm i
sudo npm i --save-dev
sudo npm run build
```

`sudo chmod +x ~/update.sh`