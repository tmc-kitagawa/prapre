package com.example.backend

import com.example.backend.dataclass.Presentation
import com.example.backend.dataclass.Request
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.test.context.jdbc.Sql

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Sql("/insert_test_data.sql")
class BackendApplicationTests(
	@Autowired val restTemplate: TestRestTemplate,
	@LocalServerPort val port: Int
) {

	@Test
	fun contextLoads() {
	}

	@Test
	fun `GETリクエストはOKステータスを返す`(){
		val response = restTemplate.getForEntity("http://localhost:$port/api/presentations", String::class.java)
		assertThat(response.statusCode, equalTo(HttpStatus.OK))
	}

	@Test
	fun `GETリクエストはPresentationsオブジェクトのリストを返す`() {
		val response = restTemplate.getForEntity("http://localhost:$port/api/presentations", Array<Presentation>::class.java)
		assertThat(response.headers.contentType, equalTo(MediaType.APPLICATION_JSON))
		val presentations = response.body!!
		assertThat(presentations.size, equalTo(5))
		assertThat(presentations[0].id, equalTo(1))
		assertThat(presentations[0].title, equalTo("firstTitle"))
		assertThat(presentations[1].id, equalTo(2))
		assertThat(presentations[1].title, equalTo("secondTitle"))
	}

	@Test
	fun `GET-userIdリクエストはOKステータスを返す`() {
		val response = restTemplate.getForEntity("http://localhost:$port/api/presentations/3", String::class.java)
		assertThat(response.statusCode, equalTo(HttpStatus.OK))
	}
	@Test
	fun `GET-userIdリクエストはPresentationsオブジェクトのリストを返す`() {
		val response = restTemplate.getForEntity("http://localhost:$port/api/presentations/3", Array<Presentation>::class.java)
		assertThat(response.headers.contentType, equalTo(MediaType.APPLICATION_JSON))
		val presentations = response.body!!
		assertThat(presentations.size, equalTo(1))
		assertThat(presentations[0].id, equalTo(3))
		assertThat(presentations[0].title, equalTo("thirdTitle"))
	}

	@Test
	fun `GET-userIdリクエストはPresentationsオブジェクトを降順で返す`() {
		val response = restTemplate.getForEntity("http://localhost:$port/api/presentations/1", Array<Presentation>::class.java)
		assertThat(response.headers.contentType, equalTo(MediaType.APPLICATION_JSON))
		val presentations = response.body!!
		assertThat(presentations.size, equalTo(2))
		assertThat(presentations[0].id, equalTo(2))
		assertThat(presentations[0].title, equalTo("secondTitle"))
	}

	@Test
	fun `POSTリクエストはステータスコード201を返す`(){
		val request = Request("titleだよ", 1719904090394, 1, 50, 50, 50,50, 50)
		val response = restTemplate.postForEntity("http://localhost:$port/api/histories", request, String::class.java)
		assertThat(response.statusCode, equalTo(HttpStatus.CREATED))
	}

	@Test
	fun `POSTリクエストはPresentationsレコードを追加される`() {
		val beforeGetResponse = restTemplate.getForEntity("http://localhost:$port/api/presentations", Array<Presentation>::class.java)
		val beforePresentations = beforeGetResponse.body!!.size

		val postRequest = Request("titleだよ", 1719904090394, 1, 50, 50, 50,50, 50)
		val response = restTemplate.postForEntity("http://localhost:$port/api/histories", postRequest, String::class.java)

		val afterGetResponse = restTemplate.getForEntity("http://localhost:$port/api/presentations", Array<Presentation>::class.java)
		val afterPresentations = afterGetResponse.body!!.size

		assertThat(beforePresentations + 1, equalTo(afterPresentations))
	}
}
