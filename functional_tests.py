from selenium.common.exceptions import WebDriverException

MAX_WAIT = 10

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
import unittest

class NewVisitorTest(unittest.TestCase):  

    def setUp(self):  
        self.browser = webdriver.Firefox()

    def tearDown(self):  
        self.browser.quit()

    def check_for_row_in_list_table(self, row_text):
        start_time = time.time()
        while True:  
            try:
                table = self.browser.find_element_by_id('id_word_table')  
                rows = table.find_elements_by_tag_name('tr')
                self.assertIn(row_text, [row.text for row in rows])
                return  
            except (AssertionError, WebDriverException) as e:  
                if time.time() - start_time > MAX_WAIT:  
                    raise e  
                time.sleep(0.5)

    def check_for_row_in_explanation_table(self, row_text):
        start_time = time.time()
        while True:  
            try:
                table = self.browser.find_element_by_id('id_explanation_table')  
                rows = table.find_elements_by_tag_name('tr')
                self.assertIn(row_text, [row.text for row in rows])
                return  
            except (AssertionError, WebDriverException) as e:  
                if time.time() - start_time > MAX_WAIT:  
                    raise e  
                time.sleep(0.5)

    def test_can_start_a_list_and_retrieve_it_later_and_search(self):  
        # Ann has heard about a cool new online word app. She goes
        # to check out its homepage
        self.browser.get('http://localhost:3000')

        # She notices the page title and header mention Word Bucket lists
        self.assertIn('Word Bucket', self.browser.title)
        header_text = self.browser.find_element_by_tag_name('h1').text  
        self.assertIn('Word Bucket', header_text) 
        
        # She is invited to enter a word item straight away
        inputbox = self.browser.find_element_by_id('id_new_word')
        self.assertEqual(
            inputbox.get_attribute('placeholder'),
            'Add new word'
        )
        
        # She types "weeb" into a text box and "otaku!" in a explanation text box
        inputbox.send_keys('weeb')
        explanationbox = self.browser.find_element_by_id('id_new_eplanation')
        explanationbox.send_keys('otaku!')
        
        # When she hits enter, the page updates, and now the page word lists
        # "1: weeb" as an item in a word list table
        inputbox.send_keys(Keys.ENTER)  
        self.check_for_row_in_list_table('weeb')
        
        # There is still a text box inviting her to add another item. She
        # enters "PogChamp" and "awesome!" in a explanation text box
        inputbox = self.browser.find_element_by_id('id_new_word')
        inputbox.send_keys('PogChamp')
        explanationbox = self.browser.find_element_by_id('id_new_eplanation')
        explanationbox.send_keys('awesome!')
        inputbox.send_keys(Keys.ENTER)

        # The page updates again, and now shows both items on website's word
        self.check_for_row_in_list_table('weeb')
        self.check_for_row_in_list_table('PogChamp')

        # She type "we" in search text box
        inputbox = self.browser.find_element_by_id('id_search')
        inputbox.send_keys('we')
        inputbox.send_keys(Keys.ENTER)

        # Now html render 'search' page. and 'weeb' url appear on her screen
        self.check_for_row_in_list_table('weeb')

if __name__ == '__main__':  
    unittest.main(warnings='ignore')
