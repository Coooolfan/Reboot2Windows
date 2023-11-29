#!/bin/bash

# base64解码后的内容为/The decoded content of Base64 is:
# 
# WINDOWS_TITLE=`grep -i 'windows' /boot/grub/grub.cfg|cut -d"'" -f2`
# sudo grub-reboot "$WINDOWS_TITLE"
# sudo reboot

echo "V0lORE9XU19USVRMRT1gZ3JlcCAtaSAnd2luZG93cycgL2Jvb3QvZ3J1Yi9ncnViLmNmZ3xjdXQgLWQiJyIgLWYyYApzdWRvIGdydWItcmVib290ICIkV0lORE9XU19USVRMRSIKc3VkbyByZWJvb3QK" | base64 --decode > ~/.reboot2win.sh

chmod +x ~/.reboot2win.sh

gnome-extensions install Reboot2Windows@coooolfan.com.shell-extension.zip --force