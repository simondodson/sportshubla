import React, { useState, useEffect } from 'react';
import { YoutubeVideo as YoutubeVideoInterface } from './../../interfaces/youtubeVideo';
import { Box, Flex, Text, Grid } from '@chakra-ui/core';
import Loader from '../Loader';
import YoutubeVideo from './YoutubeVideo';
import { calculateTotalPages } from '../../utils/feed';
import ReactPaginate from 'react-paginate';
import { useRef } from 'react';
import { FaRegFrown } from 'react-icons/fa';
import SectionHeader from '../SectionHeader';
import { Link } from 'react-router-dom';
import Card from '../Card';

type Props = {
  videos?: YoutubeVideoInterface[];
  isFetching: Boolean;
  videosPerPage?: number;
  displayTeamLink?: boolean;
  isPreview?: boolean;
};

const YoutubeFeed = ({
  videos = [],
  isFetching = false,
  videosPerPage = 8,
  displayTeamLink = false,
  isPreview = false
}: Props) => {
  const [page, setPage] = useState(0);
  const [visibleVideos, setVisibleVideos] = useState(videos);
  const totalPages = calculateTotalPages(videos.length, videosPerPage);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videos || !videos.length) return setVisibleVideos([]);

    const pagedTweets = videos.slice(page * videosPerPage, (page + 1) * videosPerPage);

    setVisibleVideos(pagedTweets);
  }, [page, videos, videosPerPage]);

  const onPageChange = ({ selected }: { selected: number }) => {
    scrollTo();
    setTimeout(() => setPage(selected), 500);
  };

  const scrollTo = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <SectionHeader title="Videos" />

      <Box ref={ref}>
        {isFetching ? (
          <Loader />
        ) : (
          <Card mb={4}>
            <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))">
              {visibleVideos.map(video => (
                <YoutubeVideo key={video.id} video={video} displayTeamLink={displayTeamLink} />
              ))}
            </Grid>

            {!!videos.length ? (
              <Box marginBottom={-6}>
                <Flex justifyContent="flex-end">
                  {isPreview ? (
                    <Link to="/videos">
                      <Flex color="blue.700" my={4} p={1} alignItems="center">
                        <Text>View all</Text>
                      </Flex>
                    </Link>
                  ) : (
                    <ReactPaginate
                      containerClassName="pagination"
                      pageCount={totalPages}
                      pageRangeDisplayed={1}
                      marginPagesDisplayed={1}
                      forcePage={page}
                      onPageChange={onPageChange}
                    />
                  )}
                </Flex>
              </Box>
            ) : (
              <Flex justifyContent="center" p={5}>
                <Box>
                  <Flex justifyContent="center" fontSize="2xl">
                    <FaRegFrown />
                  </Flex>
                  No Videos Available
                </Box>
              </Flex>
            )}
          </Card>
        )}
      </Box>
    </>
  );
};

export default YoutubeFeed;
