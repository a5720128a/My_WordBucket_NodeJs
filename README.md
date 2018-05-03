# wordbucket

Assignment 1 : My webapp. < WordBucket > by django framework
เป็นส่วนหนึ่งของวิชา Software Development Practice II
ภาษาที่ไม่มีการนำไปใช้ในชีวิตประจำวันเราเรียกว่า “ภาษาที่ตายแล้ว” ปัจจุบันแต่ละวันที่คำศัพท์เกิดใหม่มากมาย
เช่น 
- weeb A weeb (/wi b/) is a non-Japanese male who watches and is a fan of CGDCT anime, has a waifu, a waifu pillow and is obsessed with Japan. [Credit](https://www.urbandictionary.com/define.php?term=weeb)

- Jagoogala = just google it!
ซึ่ง webapp. ที่อยากสร้างคือ word bank ให้ user มาแชร์ และ เก็บคำศัพท์ใหม่ๆที่เกิดขึ้นในปัจจุบัน

## Features

* Add word (with description)
* Search (find word)
* Browse (a-z)
* Vote (useful or not)

Domain name we thought “https://WordBucket.com/”

==== Future Features ====
* login system
* csv


# Django part

## Model

3 classes
* word
* explanation
* like and dislike

## View

* home_page : หน้า home page ของ webapp.
* add_word : เพิ่มคำศัพท์พร้อมคำอธิบาย (ถ้าคำศัพท์ซ้ำจะโชว์ url ของคำศัพท์นั้นๆ เพื่อให้ user เข้าไปเพิ่ม คำอธิบาย ของตัวเองใน คำศัพท์ที่มีอยู่แล้วได้)
* view_word : ดูในแต่คำมีคำอธิบายอะไรบ้าง
* add_explanation : ใส่คำอธิบายเพิ่มในคำๆนั้น
* vote_like : โหวตชอบ
* vote_dislike : โหวตไม่ชอบ
* search : ค้นหาคำศัพท์

==== Future View function ====
(after login system)
* remove_word (for admin) : ลบคำศัพท์สำหรับ เช่น Racism’s word
* user_vote : โหวตของ user

## URL config

link urls.py ของ project กับ urls.py ของ app. name เหมือนชื่อ function ทุกอัน
 
* home_page > '' (path)
* add_word > 'add' (path)
* view_word > r'^(\d+)/$' (repath)
* add_explanation > r'^(\d+)/add_explanation$' (re_path)
* vote_like > r'^(\d+)/vote_like$' (re_path)
* vote_dislike > r'^(\d+)/vote_dislike$' (re_path)
* search > r'^search/(.+)$' (re_path)

## Tests

functional test 

unit test

now have 7 classes

* HomePageTest
* WordViewTest
* NewWordTest
* NewExplanationTest
* VoteTest
* AllAroundModelsTest
* SearchAndBrowseTest


## รายชื่อสมาชิกกลุ่ม

* นาย ศุภณ์กัญจน์ สัตตพงศ์ 5701012620128 [blog link](https://b2-5720128.blogspot.com/)
* นาย ไอยคุปต์ อาภรณ์ศิริ 5701012630204 [blog link](http://sdp-5730204.blogspot.com/)
* นาย ณฤดล ทรงอนุสรณ์ 5701012610122 [blog link](https://softwaredevii.blogspot.com/)



