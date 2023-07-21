import {
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import "./css/App.css";

import { WarningTwoIcon } from "@chakra-ui/icons";
import ReactGA from "react-ga4";
import Card from "./components/Card";
import ChatConfig from "./components/ChatConfig";
import ClickText from "./components/ClickText";
import DiscordModal from "./components/DiscordModal";
import Link from "./components/Link";
import { API_BASE_URL, ITEMS } from "./constants";
import { Data } from "./types";

export default function App() {
  const [data, setData] = useState<Data>({
    loaded: false,
    info: {},
    wakzoo: {},
    bangon: {
      info: {
        idx: "",
        date: "",
        wakIdx: "",
        wakDate: "",
        comment: [],
      },
      members: {},
    },
    watch: {},
  });

  const [error, setError] = useState(false);

  const [count, setCount] = useState(0);
  const [url, setUrl] = useState("");
  const {
    isOpen: dIsOpen,
    onOpen: dOnOpen,
    onClose: dOnClose,
  } = useDisclosure();

  const {
    isOpen: gdIsOpen,
    onOpen: gdOnOpen,
    onClose: gdOnClose,
  } = useDisclosure();

  const {
    isOpen: cIsOpen,
    onOpen: cOnOpen,
    onClose: cOnClose,
  } = useDisclosure();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("cafe") !== null) {
      window.localStorage.setItem("cafe", "true");
    }

    if (params.get("watch") !== null) {
      window.localStorage.setItem("watch", "true");
    }

    if (window.localStorage.getItem("cafe")) {
      ReactGA.event({
        category: "cafe",
        action: "cafe",
      });
    }

    if (window.localStorage.getItem("watch")) {
      ReactGA.event({
        category: "watch",
        action: "watch",
      });
    }

    if (params.get("make")) {
      setUrl(`https://discord.com/api/webhooks/${params.get("make")}`);
    }

    (async () => {
      // a
      const dataRoute = params.get("data") || "/data";

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      try {
        const res = await fetch(API_BASE_URL + dataRoute, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const json = await res.json();

        setData({
          loaded: true,
          ...json,
        });
      } catch (_) {
        setError(true);
      }
    })();

    (async () => {
      const res = await fetch(API_BASE_URL + "/status");
      const json = await res.json();

      setCount(json.count);
    })();
  }, []);

  useEffect(() => {
    if (url !== "") {
      console.log(url);
      dOnOpen();
    }
  }, [url, dOnOpen]);

  return (
    <div className="App">
      {data.loaded ? (
        <>
          <div className="content">
            <Flex justifyContent="center" alignItems="center">
              <Box margin={10} mb={20} textAlign="center" maxW="600px">
                <Flex flexDirection="column">
                  <Image
                    src="/logo.png"
                    alt="왁스코드"
                    display="inline"
                    w="sm"
                  />

                  <Button
                    onClick={dOnOpen}
                    colorScheme="blue"
                    mt={0}
                    flexGrow="inherit"
                  >
                    디스코드로 알림 받아보기
                  </Button>
                </Flex>

                {/* <ClickText onClick={gdOnOpen}>
              세구님이 장기 휴뱅 선언을 했어요. 가끔 채팅창에 출몰하는 세구님
              만나보기
            </ClickText> */}

                <DiscordModal isOpen={dIsOpen} onClose={dOnClose} url={url} />
                <DiscordModal
                  isOpen={gdIsOpen}
                  onClose={gdOnClose}
                  url={url}
                  gosegu
                />
              </Box>
            </Flex>

            <Alert status="error" mb="10">
              <AlertIcon />
              <Box>
                <AlertTitle>왁스코드가 미친 진짜 쥰내 아파요</AlertTitle>
                <AlertDescription>
                  사실 왁스코드가 아픈게 아니고 개발자인 제가 아픈거였답니다~{" "}
                  <Link href="https://cafe.naver.com/steamindiegame/12135226">
                    (왁물원 사과문 링크)
                  </Link>
                </AlertDescription>
              </Box>
            </Alert>

            <Alert status="error" mb="10">
              <AlertIcon />
              <Box>
                <AlertTitle>왁스코드가 아파요</AlertTitle>
                <AlertDescription>
                  현재 왁스코드에 큰 문제가 생겨 디스코드로 오는 메시지가 매우
                  느리게 오거나, 아예 오지 않게 돠는 문제가 발생중입니다. 불편을
                  드려 사과드립니다.
                  <br />
                  <br />
                  문제가 해결되기 전까지는 왁스코드 사이트 또는 각 스트리머의
                  트위치에서 내용들을 확인해주세요.
                </AlertDescription>
              </Box>
            </Alert>

            {Object.entries(ITEMS).map((item, index) => (
              <Card
                key={index}
                name={item[0]}
                data={item[1]}
                info={data.info[item[0]]}
                watch={data.watch[item[0]]}
                wakzoo={data.wakzoo[item[0]]}
                bangon={data.bangon.members[item[0]]}
              />
            ))}

            <Divider />
          </div>

          <div className="footer">
            <Flex
              bgColor="#c5c5c5"
              padding={10}
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <Text>{count}개의 웹후크가 정보를 받아보는 중</Text>
              <ClickText onClick={cOnOpen}>채팅 설정</ClickText>
              <ChatConfig
                isOpen={cIsOpen}
                onOpen={cOnOpen}
                onClose={cOnClose}
              />

              <Box mb={3} />
              <Text>=== Reference ===</Text>

              <Link
                href={`https://cafe.naver.com/steamindiegame/${data.bangon.info.idx}`}
              >
                [{data.bangon.info.date}] 이세돌 뱅온정보
              </Link>
              <Link
                href={`https://cafe.naver.com/steamindiegame/${data.bangon.info.wakIdx}`}
              >
                [{data.bangon.info.wakDate}] 왁피스 일기장
              </Link>
              <Link href="https://github.com/JellyBrick/SeguFont">
                세구세구체
              </Link>
              <Link href="https://github.com/minibox24/wakscord">깃허브</Link>

              <Box mb={3} />
              <Text>=== Support ===</Text>
              <Text>contact@wakscord.xyz</Text>
              <Link href="https://discord.gg/pbd2xXJ">
                디스코드 서포트 서버
              </Link>
            </Flex>
          </div>
        </>
      ) : (
        <Flex
          height="100vh"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Image
            src="/logo.png"
            alt="왁스코드"
            w="sm"
            className={error ? "" : "loadingLogo"}
          />

          {error && (
            <>
              <Box width="sm" height="sm" position="absolute" textAlign="right">
                <WarningTwoIcon color="red" w="8rem" h="8rem" />
              </Box>

              <span>정보를 불러오던 중 오류 발생</span>
              <Link href="https://discord.gg/pbd2xXJ">
                디스코드 서포트 서버
              </Link>
            </>
          )}
        </Flex>
      )}
    </div>
  );
}
